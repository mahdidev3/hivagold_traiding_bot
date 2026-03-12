from workers.api_server.app.service import ApiServerService


class DummyClient:
    def __init__(self):
        self.calls = []
        self.status_payload = {"active": True, "reason": "in_shift"}

    def post(self, path, body):
        self.calls.append(("post", path, body))
        return {"success": True, "path": path, "body": body}

    def get(self, path):
        self.calls.append(("get", path, None))
        return {"success": True, "path": path}

    def get_absolute(self, url):
        self.calls.append(("get_absolute", url, None))
        return self.status_payload


class DummyConfig:
    DEFAULT_MARKET = "xag"
    MARKET_CHOICES = ("xag", "mazaneh", "ounce")


def test_api_server_service_routes_to_workers():
    auth = DummyClient()
    room = DummyClient()
    trading = DummyClient()
    service = ApiServerService(DummyConfig(), auth, room, trading)

    login_result = service.execute("login", {"mobile": "0912", "password": "x"})
    assert login_result["success"] is True
    assert auth.calls[-1][1] == "/login"

    signal_result = service.execute("get_signals", {})
    assert signal_result["path"] == "/signals/latest"

    portfolio_result = service.execute("create_portfolio", {"mobile": "0912"})
    assert portfolio_result["path"] == "/room/portfolios/active"
    assert room.calls[-1][0] == "post"


def test_room_action_blocks_when_room_is_closed():
    room = DummyClient()
    room.status_payload = {"active": True, "reason": "out_of_shift"}
    service = ApiServerService(DummyConfig(), DummyClient(), room, DummyClient())

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
    service = ApiServerService(DummyConfig(), DummyClient(), room, DummyClient())

    service.execute(
        "room_action",
        {
            "endpoint": "/room/orders",
            "mobile": "0912",
            "base_domain": "https://demo.hivagold.com",
            "market": "mazaneh",
        },
    )

    method, path, body = room.calls[-1]
    assert method == "post"
    assert path == "/room/orders"
    assert body["room_prefix"] == "/mazaneh"
