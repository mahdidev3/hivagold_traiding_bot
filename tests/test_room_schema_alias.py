from workers.bot_room_worker.app.schemas import CreateOrderRequest


def test_order_alias_supports_ordertype():
    payload = {
        "mobile": "0912",
        "ordertype": "market",
        "action": "buy",
        "units": 1,
    }
    req = CreateOrderRequest(**payload)
    assert req.order_type == "market"
