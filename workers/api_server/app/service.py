import logging
from typing import Any, Protocol
from urllib.parse import urlparse


from config import Config


class WorkerClientProtocol(Protocol):
    def post(self, path: str, body: dict[str, Any]) -> dict[str, Any]: ...

    def get(self, path: str) -> dict[str, Any]: ...


class ApiServerService:
    def __init__(
        self,
        config: Config,
        auth_client: WorkerClientProtocol,
        trading_client: WorkerClientProtocol,
        portfolio_client: WorkerClientProtocol,
        logger: logging.Logger | None = None,
    ):
        self.config = config
        self.auth_client = auth_client
        self.trading_client = trading_client
        self.portfolio_client = portfolio_client
        self.logger = logger or logging.getLogger(__name__)

    def _normalize_mobile(self, mobile: str) -> str:
        value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
        if value.startswith("0098") and len(value) >= 12:
            value = "0" + value[4:]
        elif value.startswith("98") and len(value) >= 12:
            value = "0" + value[2:]
        elif len(value) == 10 and not value.startswith("0"):
            value = f"0{value}"
        return value

    def _normalize_base_domain(self, base_domain: str | None) -> str | None:
        if not base_domain:
            return None
        value = base_domain.strip()
        if not value:
            return None
        parsed = urlparse(value if "://" in value else f"https://{value}")
        if not parsed.netloc:
            return None
        return f"{parsed.scheme}://{parsed.netloc}"

    def _prepare_auth_payload(self, payload: dict[str, Any]) -> dict[str, Any]:
        prepared = payload.copy()
        prepared["mobile"] = self._normalize_mobile(prepared.get("mobile", ""))
        if not prepared["mobile"]:
            raise ValueError("Invalid mobile number")
        normalized_domain = self._normalize_base_domain(prepared.get("base_domain"))
        if normalized_domain:
            prepared["base_domain"] = normalized_domain
        return prepared

    def execute(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        self.logger.debug("Executing action=%s", action)
        if action == "login":
            return self.auth_client.post("/login", self._prepare_auth_payload(payload))
        if action == "logout":
            return self.auth_client.post("/logout", self._prepare_auth_payload(payload))
        if action == "get_signals":
            return self.trading_client.get("/signals/latest")
        if action == "portfolio_order_create":
            return self.portfolio_client.post("/portfolio/orders", payload)
        if action == "portfolio_price_tick":
            return self.portfolio_client.post("/portfolio/price", payload)
        if action == "portfolio_user_stats":
            return self.portfolio_client.get(f"/portfolio/users/{payload['user_id']}/stats")
        if action == "portfolio_user_history":
            return self.portfolio_client.get(f"/portfolio/users/{payload['user_id']}/history")
        if action == "portfolio_position_update":
            return self.portfolio_client.post(
                f"/portfolio/users/{payload['mobile']}/positions/{payload['position_id']}",
                payload,
            )
        if action == "portfolio_position_close":
            return self.portfolio_client.post(
                f"/portfolio/users/{payload['mobile']}/positions/{payload['position_id']}/close",
                payload,
            )
        if action == "strategy_task_create":
            return self.portfolio_client.post("/strategy/tasks", payload)
        if action == "portfolio_db_records":
            return self.portfolio_client.get("/portfolio/db/records")
        if action == "portfolio_admin_db":
            return self.portfolio_client.get("/portfolio/admin/db")
        return {"success": False, "error": f"Unsupported action: {action}"}
