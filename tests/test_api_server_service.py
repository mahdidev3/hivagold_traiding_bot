from workers.api_server.app.service import ApiServerService


class DummyClient:
    def __init__(self):
        self.calls = []

    def post(self, path, body):
        self.calls.append(("post", path, body))
        return {"success": True, "path": path, "body": body}

    def get(self, path):
        self.calls.append(("get", path, None))
        return {"success": True, "path": path}


def test_api_server_service_routes_to_workers():
    auth = DummyClient()
    room = DummyClient()
    trading = DummyClient()
    service = ApiServerService(auth, room, trading)

    login_result = service.execute("login", {"mobile": "0912", "password": "x"})
    assert login_result["success"] is True
    assert auth.calls[-1][1] == "/login"

    signal_result = service.execute("get_signals", {})
    assert signal_result["path"] == "/signals/latest"

    portfolio_result = service.execute("create_portfolio", {"mobile": "0912"})
    assert portfolio_result["path"] == "/room/portfolios/active"
    assert room.calls[-1][0] == "post"
