from workers.api_server.app.service import ApiServerService


class DummyClient:
    def __init__(self):
        self.calls = []
        self.status_payload = {"success": True, "market": "xag", "is_open": True, "active": True, "reason": "in_shift"}

    def post(self, path: str, body: dict):
        self.calls.append(("post", path, body))
        if path == "/room/status":
            return self.status_payload
        return {"success": True, "path": path, "body": body}

    def get(self, path: str):
        self.calls.append(("get", path, None))
        return {"success": True, "path": path}


class DummyConfig:
    DEFAULT_MARKET = "xag"
    MARKET_CHOICES = ("xag", "mazaneh", "ounce")


def build_service(room: DummyClient | None = None, portfolio: DummyClient | None = None):
    return ApiServerService(
        DummyConfig(),
        DummyClient(),
        room or DummyClient(),
        DummyClient(),
        portfolio or DummyClient(),
    )


def test_api_server_service_routes_to_workers():
    auth = DummyClient()
    room = DummyClient()
    trading = DummyClient()
    portfolio = DummyClient()
    service = ApiServerService(DummyConfig(), auth, room, trading, portfolio)

    login_result = service.execute("login", {"mobile": "0912", "password": "x"})
    assert login_result["success"] is True
    assert auth.calls[-1][1] == "/login"

    signal_result = service.execute("get_signals", {})
    assert signal_result["path"] == "/signals/latest"

    portfolio_result = service.execute("create_portfolio", {"mobile": "0912"})
    assert portfolio_result["path"] == "/room/portfolio/create"
    assert trading.calls[-1][0] == "post"


def test_room_action_blocks_when_room_is_closed():
    room = DummyClient()
    room.status_payload = {"success": True, "market": "xag", "is_open": False, "active": True, "reason": "out_of_shift"}
    trading = DummyClient()
    trading.status_payload = room.status_payload
    service = build_service(room=room)
    service.trading_client = trading

    result = service.execute(
        "room_action",
        {
            "endpoint": "/room/orders",
            "mobile": "0912",
            "base_domain": "https://demo.hivagold.com",
            "market": "xag",
        },
    )

    assert result["success"] is False
    assert "closed" in result["error"].lower()


def test_room_action_sets_room_prefix_from_market():
    room = DummyClient()
    room.status_payload = {
        "success": True,
        "market": "mazaneh",
        "is_open": True,
        "active": True,
        "reason": "in_shift",
    }
    trading = DummyClient()
    trading.status_payload = room.status_payload
    service = build_service(room=room)
    service.trading_client = trading

    service.execute(
        "room_action",
        {
            "endpoint": "/room/orders",
            "mobile": "0912",
            "base_domain": "https://demo.hivagold.com",
            "market": "mazaneh",
        },
    )

    method, path, body = service.trading_client.calls[-1]
    assert method == "post"
    assert path == "/room/orders"
    assert body["room_prefix"] == "/mazaneh"


def test_room_status_proxies_to_room_worker():
    room = DummyClient()
    room.status_payload = {
        "success": True,
        "market": "ounce",
        "is_open": True,
        "active": True,
        "reason": "in_shift",
    }
    trading = DummyClient()
    trading.status_payload = room.status_payload
    service = build_service(room=room)
    service.trading_client = trading

    result = service.execute(
        "check_room_status",
        {"mobile": "0912", "base_domain": "https://demo.hivagold.com", "market": "ounce"},
    )

    assert result["success"] is True
    assert result["market"] == "ounce"


def test_portfolio_actions_route_to_portfolio_worker():
    portfolio = DummyClient()
    service = build_service(portfolio=portfolio)

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

    records = service.execute("portfolio_db_records", {})
    assert records["path"] == "/portfolio/db/records"

    pnl_positions = service.execute(
        "portfolio_strategy_pnl_positions", {"strategy": "ema_wall_v1"}
    )
    assert pnl_positions["path"] == "/portfolio/strategies/ema_wall_v1/pnl-positions"

    admin = service.execute("portfolio_admin_db", {})
    assert admin["path"] == "/portfolio/admin/db"
