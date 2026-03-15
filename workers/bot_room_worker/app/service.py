import logging
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import requests

from config import Config
from .clients import (
    UserSessionStore,
    OrdersClient,
    PortfolioClient,
    normalize_mobile,
)


def _normalize_base_domain(base_domain: Optional[str], config: Config) -> str:
    resolved = (base_domain or config.BASE_DOMAIN).strip()
    parsed = urlparse(resolved if "://" in resolved else f"https://{resolved}")
    if parsed.hostname:
        host = parsed.hostname.lower()
        if parsed.port:
            host = f"{host}:{parsed.port}"
        return f"{parsed.scheme}://{host}"
    return resolved.rstrip("/")


def _build_room_url(base_domain: str, room_prefix: str, path: str) -> str:
    base = (base_domain or "").rstrip("/")
    prefix = f"/{(room_prefix or '').strip('/')}" if room_prefix else ""
    suffix = f"/{(path or '').lstrip('/')}" if path else ""
    return f"{base}{prefix}{suffix}"


class BaseRoomService:
    def __init__(
        self,
        config: Config,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        self.config = config
        self.session_store = session_store
        self.logger = logger

    def _resolve_room_prefix(self, room_prefix: Optional[str]) -> str:
        normalized = (room_prefix or self.config.ROOM_PREFIX or "").strip()
        if not normalized:
            return ""
        return f"/{normalized.strip('/')}"

    def _load_session(
        self, mobile: Optional[str], base_domain: Optional[str]
    ) -> tuple[Optional[str], Optional[dict], Optional[dict], Optional[str]]:
        normalized_mobile = normalize_mobile(mobile or "")
        if not normalized_mobile:
            return None, None, None, "Mobile is required"

        resolved_base_domain = _normalize_base_domain(base_domain, self.config)
        session_data = self.session_store.get_session_data(
            normalized_mobile, resolved_base_domain
        )
        if not session_data:
            return (
                resolved_base_domain,
                None,
                None,
                "Session not found. Please login first.",
            )

        cookies = session_data.get("cookies")
        headers = session_data.get("headers")
        if not cookies:
            return (
                resolved_base_domain,
                None,
                None,
                "Cookies not found in session. Please login again.",
            )
        return resolved_base_domain, cookies, headers, None


class CheckRoomStatusService(BaseRoomService):
    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            market = (args.get("market") or "xag").strip().lower()
            if market not in {"xag", "mazaneh", "ounce"}:
                return {
                    "success": False,
                    "market": market,
                    "is_open": False,
                    "error": "Unsupported market. Allowed values: xag, mazaneh, ounce",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {
                    "success": False,
                    "market": market,
                    "is_open": False,
                    "error": error,
                }

            status_url = _build_room_url(base_domain, f"/{market}", "/api/status/")
            response = requests.get(status_url, cookies=cookies, headers=headers, timeout=10)
            response.raise_for_status()
            payload = response.json()

            active = payload.get("active")
            reason = payload.get("reason")
            is_open = bool(active) and reason != "out_of_shift"
            return {
                "success": True,
                "market": market,
                "is_open": is_open,
                "active": active,
                "reason": reason,
                "notification": payload.get("notification"),
            }
        except requests.RequestException as exc:
            self.logger.error(f"Error checking room status: {exc}")
            return {
                "success": False,
                "market": (args.get("market") or "xag").strip().lower(),
                "is_open": False,
                "error": f"Room status request failed: {exc}",
            }
        except Exception as exc:
            self.logger.error(f"Unexpected error checking room status: {exc}")
            return {
                "success": False,
                "market": (args.get("market") or "xag").strip().lower(),
                "is_open": False,
                "error": str(exc),
            }


class GetPortfoliosService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        portfolio_client: PortfolioClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.portfolio_client = portfolio_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "portfolios": None, "error": error}

            get_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/portfolio/active/"
            )
            portfolios = self.portfolio_client.get_portfolios(
                get_url=get_url,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "portfolios": portfolios}
        except Exception as exc:
            self.logger.error(f"Error retrieving portfolios: {exc}")
            return {"success": False, "portfolios": None, "error": str(exc)}


class CreateActivePortfolioService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        portfolio_client: PortfolioClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.portfolio_client = portfolio_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            portfolio_type = args.get("portfolio_type")
            initial_balance = args.get("initial_balance", 1000000)

            if not portfolio_type:
                return {
                    "success": False,
                    "portfolio": None,
                    "error": "Portfolio type is required",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "portfolio": None, "error": error}

            create_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/portfolio/create/"
            )
            portfolio = self.portfolio_client.create_portfolio(
                create_url=create_url,
                portfolio_type=portfolio_type,
                initial_balance=initial_balance,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "portfolio": portfolio}
        except Exception as exc:
            self.logger.error(f"Error creating active portfolio: {exc}")
            return {"success": False, "portfolio": None, "error": str(exc)}


class GetOrdersService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        orders_client: OrdersClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.orders_client = orders_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "orders": None, "error": error}

            get_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/order/active/"
            )
            orders = self.orders_client.get_active_orders(
                get_url=get_url,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "orders": orders}
        except Exception as exc:
            self.logger.error(f"Error retrieving orders: {exc}")
            return {"success": False, "orders": None, "error": str(exc)}


class CreateOrderService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        orders_client: OrdersClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.orders_client = orders_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            order_type = args.get("order_type") or args.get("ordertype")
            action = args.get("action")
            units = args.get("units")
            price = args.get("price")
            stop_loss = args.get("stop_loss")
            take_profit = args.get("take_profit")

            if not order_type:
                return {
                    "success": False,
                    "order": None,
                    "error": "Order type is required",
                }
            if not action:
                return {"success": False, "order": None, "error": "Action is required"}
            if units is None:
                return {"success": False, "order": None, "error": "Units is required"}
            if order_type == "limit" and price is None:
                return {
                    "success": False,
                    "order": None,
                    "error": "Price is required for limit orders",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "order": None, "error": error}

            create_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/order/create/"
            )
            order = self.orders_client.create_order(
                create_url=create_url,
                order_type=order_type,
                action=action,
                units=units,
                mobile=mobile,
                base_domain=base_domain,
                price=price,
                stop_loss=stop_loss,
                take_profit=take_profit,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "order": order}
        except Exception as exc:
            self.logger.error(f"Error creating order: {exc}")
            return {"success": False, "order": None, "error": str(exc)}


class CloseOrderService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        orders_client: OrdersClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.orders_client = orders_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            order_id = args.get("order_id")
            if not order_id:
                return {
                    "success": False,
                    "order": None,
                    "error": "Order ID is required",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "order": None, "error": error}

            close_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/order/close/"
            )
            order = self.orders_client.close_order(
                close_url=close_url,
                order_id=order_id,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "order": order}
        except Exception as exc:
            self.logger.error(f"Error closing order: {exc}")
            return {"success": False, "order": None, "error": str(exc)}


class GetTransactionsService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        portfolio_client: PortfolioClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.portfolio_client = portfolio_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "transactions": None, "error": error}

            get_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/transaction/"
            )
            transactions = self.portfolio_client.get_transactions(
                get_url=get_url,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "transactions": transactions}
        except Exception as exc:
            self.logger.error(f"Error retrieving transactions: {exc}")
            return {"success": False, "transactions": None, "error": str(exc)}


class CloseTransactionService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        portfolio_client: PortfolioClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.portfolio_client = portfolio_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            transaction_id = args.get("transaction_id")
            if not transaction_id:
                return {
                    "success": False,
                    "transaction": None,
                    "error": "Transaction ID is required",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {"success": False, "transaction": None, "error": error}

            close_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/transaction/close/"
            )
            transaction = self.portfolio_client.close_transaction(
                close_url=close_url,
                transaction_id=str(transaction_id),
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {"success": True, "transaction": transaction}
        except Exception as exc:
            self.logger.error(f"Error closing transaction: {exc}")
            return {"success": False, "transaction": None, "error": str(exc)}


class ClosePortfolioService(BaseRoomService):
    def __init__(
        self,
        config: Config,
        portfolio_client: PortfolioClient,
        orders_client: OrdersClient,
        session_store: UserSessionStore,
        logger: logging.Logger,
    ):
        super().__init__(config, session_store, logger)
        self.portfolio_client = portfolio_client
        self.orders_client = orders_client

    def _extract_active_order_ids(self, payload: Any) -> list[str]:
        orders_raw: Any = payload
        if isinstance(payload, dict):
            for key in ("results", "data", "orders", "active"):
                candidate = payload.get(key)
                if isinstance(candidate, list):
                    orders_raw = candidate
                    break
        if not isinstance(orders_raw, list):
            return []
        order_ids: list[str] = []
        for order in orders_raw:
            if not isinstance(order, dict):
                continue
            value = order.get("id")
            if value is None:
                continue
            order_ids.append(str(value))
        return order_ids

    def _extract_open_transaction_ids(self, payload: Any) -> list[str]:
        if not isinstance(payload, dict):
            return []
        open_transactions = payload.get("open")
        if not isinstance(open_transactions, list):
            return []
        transaction_ids: list[str] = []
        for transaction in open_transactions:
            if not isinstance(transaction, dict):
                continue
            value = transaction.get("id")
            if value is None:
                continue
            transaction_ids.append(str(value))
        return transaction_ids

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            mobile = args.get("mobile")
            portfolio_id = args.get("portfolio_id")
            if not portfolio_id:
                return {
                    "success": False,
                    "portfolio": None,
                    "closed_orders": [],
                    "closed_transactions": [],
                    "error": "Portfolio ID is required",
                }

            base_domain, cookies, headers, error = self._load_session(
                mobile, args.get("base_domain")
            )
            if error:
                return {
                    "success": False,
                    "portfolio": None,
                    "closed_orders": [],
                    "closed_transactions": [],
                    "error": error,
                }

            # Ensure all active orders are closed before closing portfolio.
            active_orders_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/order/active/"
            )
            active_orders = self.orders_client.get_active_orders(
                get_url=active_orders_url,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )

            closed_orders: list[str] = []
            close_order_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/order/close/"
            )
            for order_id in self._extract_active_order_ids(active_orders):
                self.orders_client.close_order(
                    close_url=close_order_url,
                    order_id=order_id,
                    mobile=mobile,
                    base_domain=base_domain,
                    cookies=cookies,
                    headers=headers,
                )
                closed_orders.append(order_id)

            transactions_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/transaction/"
            )
            transactions = self.portfolio_client.get_transactions(
                get_url=transactions_url,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )

            closed_transactions: list[str] = []
            close_transaction_url = _build_room_url(
                base_domain, self._resolve_room_prefix(args.get("room_prefix")), "/api/transaction/close/"
            )
            for transaction_id in self._extract_open_transaction_ids(transactions):
                self.portfolio_client.close_transaction(
                    close_url=close_transaction_url,
                    transaction_id=transaction_id,
                    mobile=mobile,
                    base_domain=base_domain,
                    cookies=cookies,
                    headers=headers,
                )
                closed_transactions.append(transaction_id)

            close_portfolio_url = _build_room_url(
                base_domain,
                self._resolve_room_prefix(args.get("room_prefix")),
                f"/api/portfolio/close/{portfolio_id}/",
            )
            portfolio = self.portfolio_client.close_portfolio(
                close_url=close_portfolio_url,
                portfolio_id=portfolio_id,
                mobile=mobile,
                base_domain=base_domain,
                cookies=cookies,
                headers=headers,
            )
            return {
                "success": True,
                "portfolio": portfolio,
                "closed_orders": closed_orders,
                "closed_transactions": closed_transactions,
            }
        except Exception as exc:
            self.logger.error(f"Error closing portfolio: {exc}")
            return {
                "success": False,
                "portfolio": None,
                "closed_orders": [],
                "closed_transactions": [],
                "error": str(exc),
            }


class RoomWorkerService:
    def __init__(
        self,
        get_portfolios_service: GetPortfoliosService,
        create_active_portfolio_service: CreateActivePortfolioService,
        get_orders_service: GetOrdersService,
        create_order_service: CreateOrderService,
        close_order_service: CloseOrderService,
        get_transactions_service: GetTransactionsService,
        close_transaction_service: CloseTransactionService,
        close_portfolio_service: ClosePortfolioService,
        check_room_status_service: CheckRoomStatusService,
        logger: logging.Logger,
    ):
        self.get_portfolios_service = get_portfolios_service
        self.create_active_portfolio_service = create_active_portfolio_service
        self.get_orders_service = get_orders_service
        self.create_order_service = create_order_service
        self.close_order_service = close_order_service
        self.get_transactions_service = get_transactions_service
        self.close_transaction_service = close_transaction_service
        self.close_portfolio_service = close_portfolio_service
        self.check_room_status_service = check_room_status_service
        self.logger = logger

    async def process(self, args: Dict[str, Any]) -> Dict[str, Any]:
        try:
            action = args.get("worker_action") or args.get("action")
            if action == "get_portfolios":
                return await self.get_portfolios_service.execute(args)
            if action == "create_active_portfolio":
                return await self.create_active_portfolio_service.execute(args)
            if action == "get_orders":
                return await self.get_orders_service.execute(args)
            if action == "create_order":
                return await self.create_order_service.execute(args)
            if action == "close_order":
                return await self.close_order_service.execute(args)
            if action == "get_transactions":
                return await self.get_transactions_service.execute(args)
            if action == "close_transaction":
                return await self.close_transaction_service.execute(args)
            if action == "close_portfolio":
                return await self.close_portfolio_service.execute(args)
            if action == "check_room_status":
                return await self.check_room_status_service.execute(args)

            return {"success": False, "error": f"Unknown action: {action}"}
        except Exception as exc:
            self.logger.error(f"Error processing request: {exc}")
            return {"success": False, "error": f"Error processing request: {exc}"}
