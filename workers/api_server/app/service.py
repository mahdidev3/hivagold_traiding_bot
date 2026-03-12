from typing import Any

import requests

from config import Config
from .clients import build_market_status_url


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

    def room_status(self, base_domain: str, market: str | None) -> dict[str, Any]:
        selected_market = self._normalize_market(market)
        status_url = build_market_status_url(base_domain, selected_market)
        payload = self.room_client.get_absolute(status_url)

        active = payload.get("active")
        reason = payload.get("reason")
        is_open = bool(active) and reason != "out_of_shift"

        return {
            "success": True,
            "market": selected_market,
            "is_open": is_open,
            "active": active,
            "reason": reason,
            "notification": payload.get("notification"),
        }

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
            return self.room_status(payload["base_domain"], payload.get("market"))
        if action == "room_action":
            endpoint = payload.pop("endpoint")
            try:
                room_status = self.room_status(payload["base_domain"], payload.get("market"))
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
