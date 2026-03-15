import logging
from typing import Any, Protocol

import requests

from config import Config


class WorkerClientProtocol(Protocol):
    def post(self, path: str, body: dict[str, Any]) -> dict[str, Any]: ...

    def get(self, path: str) -> dict[str, Any]: ...


class ApiServerService:
    def __init__(
        self,
        config: Config,
        auth_client: WorkerClientProtocol,
        room_client: WorkerClientProtocol,
        trading_client: WorkerClientProtocol,
        portfolio_client: WorkerClientProtocol,
        logger: logging.Logger | None = None,
    ):
        self.config = config
        self.auth_client = auth_client
        self.room_client = room_client
        self.trading_client = trading_client
        self.portfolio_client = portfolio_client
        self.logger = logger or logging.getLogger(__name__)

    def _normalize_market(self, market: str | None) -> str:
        selected = (market or self.config.DEFAULT_MARKET).strip().lower()
        if selected not in self.config.MARKET_CHOICES:
            raise ValueError(
                f"Unsupported market '{selected}'. Allowed values: {', '.join(self.config.MARKET_CHOICES)}"
            )
        return selected

    def room_status(
        self, mobile: str, base_domain: str | None, market: str | None
    ) -> dict[str, Any]:
        selected_market = self._normalize_market(market)
        payload = {"mobile": mobile, "market": selected_market}
        if base_domain:
            payload["base_domain"] = base_domain
        return self.trading_client.post("/room/status", payload)

    def execute(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.logger.debug("Executing action=%s", action)
        if action == "login":
            return self.auth_client.post("/login", payload)
        if action == "logout":
            auth_result = self.auth_client.post("/logout", payload)
            trading_result = self.trading_client.post("/state/cleanup", payload)
            return {"success": bool(auth_result.get("success") and trading_result.get("success")), "auth": auth_result, "trading": trading_result}
        if action == "create_portfolio":
            return self.trading_client.post("/room/portfolio/create", payload)
        if action == "get_signals":
            return self.trading_client.get("/signals/latest")
        if action == "check_room_status":
            return self.trading_client.post("/room/status", payload)
        if action == "bot_activate":
            return self.trading_client.post("/bot/activate", payload)
        if action == "check_room_status_old_unused":
            return self.room_status(
                payload["mobile"], payload.get("base_domain"), payload.get("market")
            )
        if action == "portfolio_rule_upsert":
            return self.portfolio_client.post("/portfolio/rules", payload)
        if action == "portfolio_order_create":
            return self.portfolio_client.post("/portfolio/orders", payload)
        if action == "portfolio_order_bot":
            return self.portfolio_client.post("/portfolio/orders/bot", payload)
        if action == "portfolio_price_tick":
            return self.portfolio_client.post("/portfolio/price", payload)
        if action == "portfolio_user_stats":
            return self.portfolio_client.get(f"/portfolio/users/{payload['user_id']}/stats")
        if action == "portfolio_db_records":
            return self.portfolio_client.get("/portfolio/db/records")
        if action == "portfolio_strategy_pnl_positions":
            strategy = payload["strategy"]
            return self.portfolio_client.get(f"/portfolio/strategies/{strategy}/pnl-positions")
        if action == "portfolio_admin_db":
            return self.portfolio_client.get("/portfolio/admin/db")
        if action == "room_action":
            endpoint = payload.pop("endpoint")
            try:
                room_status = self.room_status(
                    payload["mobile"], payload.get("base_domain"), payload.get("market")
                )
                if not room_status["is_open"]:
                    self.logger.info("Blocked room action because room is closed")
                    return {
                        "success": False,
                        "error": "Room is closed",
                        "room_status": room_status,
                    }
                payload["room_prefix"] = f"/{room_status['market']}"
                self.logger.debug(
                    "Forwarding room_action endpoint=%s room_prefix=%s",
                    endpoint,
                    payload["room_prefix"],
                )
                return self.trading_client.post(endpoint, payload)
            except requests.RequestException as exc:
                self.logger.exception("Room API request failed")
                return {
                    "success": False,
                    "error": f"Room API request failed: {exc}",
                }
            except ValueError as exc:
                self.logger.warning("Invalid room action payload: %s", exc)
                return {"success": False, "error": str(exc)}
        return {"success": False, "error": f"Unsupported action: {action}"}
