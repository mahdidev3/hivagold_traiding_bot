from typing import Any


class ApiServerService:
    def __init__(self, auth_client, room_client, trading_client):
        self.auth_client = auth_client
        self.room_client = room_client
        self.trading_client = trading_client

    def execute(self, action: str, payload: dict[str, Any]) -> dict[str, Any]:
        if action == "login":
            return self.auth_client.post("/login", payload)
        if action == "logout":
            return self.auth_client.post("/logout", payload)
        if action == "create_portfolio":
            return self.room_client.post("/room/portfolios/active", payload)
        if action == "get_signals":
            return self.trading_client.get("/signals/latest")
        if action == "room_action":
            endpoint = payload.pop("endpoint")
            return self.room_client.post(endpoint, payload)
        return {"success": False, "error": f"Unsupported action: {action}"}
