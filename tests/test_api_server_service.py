from workers.api_server.app.service import ApiServerService


class DummyClient:
    def __init__(self):
        self.calls = []

    def post(self, path: str, body: dict):
        self.calls.append(("post", path, body))
        return {"success": True, "path": path, "body": body}

    def get(self, path: str):
        self.calls.append(("get", path, None))
        return {"success": True, "path": path}


class DummyConfig:
    pass


def test_api_server_service_routes_auth_and_bot_actions():
    auth = DummyClient()
    trading = DummyClient()
    service = ApiServerService(DummyConfig(), auth, trading)

    login_result = service.execute("login", {"mobile": "0912", "password": "x"})
    assert login_result["success"] is True
    assert auth.calls[-1][1] == "/login"

    create_result = service.execute(
        "create_bot",
        {"mobile": "0912", "password": "p", "domain": "https://hivagold.com"},
    )
    assert create_result["path"] == "/trading/process"
    assert trading.calls[-1][2]["action"] == "create_bot"

    service.execute("start_bot", {"bot_id": "b1"})
    assert trading.calls[-1][2]["action"] == "start_bot"

    service.execute("stop_bot", {"bot_id": "b1"})
    assert trading.calls[-1][2]["action"] == "stop_bot"

    service.execute("remove_bot", {"bot_id": "b1"})
    assert trading.calls[-1][2]["action"] == "remove_bot"
