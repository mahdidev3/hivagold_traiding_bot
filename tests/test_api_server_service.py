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


def test_api_server_service_routes_to_workers():
    auth = DummyClient()
    trading = DummyClient()
    portfolio = DummyClient()
    service = ApiServerService(DummyConfig(), auth, trading, portfolio)

    login_result = service.execute("login", {"mobile": "0912", "password": "x"})
    assert login_result["success"] is True
    assert auth.calls[-1][1] == "/login"

    signal_result = service.execute("get_signals", {})
    assert signal_result["path"] == "/signals/latest"


def test_portfolio_actions_route_to_portfolio_worker():
    portfolio = DummyClient()
    service = ApiServerService(DummyConfig(), DummyClient(), DummyClient(), portfolio)

    create = service.execute(
        "portfolio_order_create",
        {
            "user_id": "u1",
            "side": "buy",
            "entry_type": "market",
            "take_profit": 2500,
            "stop_loss": 2450,
        },
    )
    assert create["success"] is True
    assert portfolio.calls[-1][1] == "/portfolio/orders"

    stats = service.execute("portfolio_user_stats", {"user_id": "u1"})
    assert stats["path"] == "/portfolio/users/u1/stats"

    history = service.execute("portfolio_user_history", {"user_id": "u1"})
    assert history["path"] == "/portfolio/users/u1/history"

    records = service.execute("portfolio_db_records", {})
    assert records["path"] == "/portfolio/db/records"

    admin = service.execute("portfolio_admin_db", {})
    assert admin["path"] == "/portfolio/admin/db"
