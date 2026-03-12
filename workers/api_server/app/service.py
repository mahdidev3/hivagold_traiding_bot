from typing import Any

import requests

from config import Config


class ApiServerService:
    def __init__(self, config: Config, auth_client, room_client, trading_client):
        self.config = config
        self.auth_client = auth_client
        self.room_client = room_client
        self.trading_client = trading_client

    def _normalize_market(self, market: str | None) -> str:
        selected = (market or self.config.DEFAULT_MARKET).strip().lower()
        if selected not in self.config.MARKET_CHOICES:
            raise ValueError(
                f"Unsupported market '{selected}'. Allowed values: {', '.join(self.config.MARKET_CHOICES)}"
            )
        return selected

    def room_status(self, mobile: str, base_domain: str | None, market: str | None) -> dict[str, Any]:
        selected_market = self._normalize_market(market)
        payload = {"mobile": mobile, "market": selected_market}
        if base_domain:
            payload["base_domain"] = base_domain
        return self.room_client.post("/room/status", payload)

    def execute(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        if action == "login":
            return self.auth_client.post("/login", payload)
        if action == "logout":
            return self.auth_client.post("/logout", payload)
        if action == "create_portfolio":
            return self.room_client.post("/room/portfolios/active", payload)
        if action == "get_signals":
            return self.trading_client.get("/signals/latest")
        if action == "check_room_status":
            return self.room_status(payload["mobile"], payload.get("base_domain"), payload.get("market"))
        if action == "room_action":
            endpoint = payload.pop("endpoint")
            try:
                room_status = self.room_status(payload["mobile"], payload.get("base_domain"), payload.get("market"))
                if not room_status["is_open"]:
                    return {
                        "success": False,
                        "error": "Room is closed",
                        "room_status": room_status,
                    }
                payload["room_prefix"] = f"/{room_status['market']}"
                return self.room_client.post(endpoint, payload)
            except requests.RequestException as exc:
                return {
                    "success": False,
                    "error": f"Room API request failed: {exc}",
                }
            except ValueError as exc:
                return {"success": False, "error": str(exc)}
        return {"success": False, "error": f"Unsupported action: {action}"}
