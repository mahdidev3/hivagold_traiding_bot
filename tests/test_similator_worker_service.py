import asyncio

from workers.bot_similator_worker.app.service import SimilatorService


def test_create_update_delete_position_flow():
    svc = SimilatorService(symbol="xag", start_price=2400)

    created = asyncio.run(
        svc.create_position(
            {
                "side": "buy",
                "entry_type": "limit",
                "entry_price": 2395,
                "take_profit": 2402,
                "stop_loss": 2390,
                "volume": 1,
                "symbol": "xag",
            }
        )
    )
    assert created["success"] is True
    pid = created["order"]["id"]

    updated = asyncio.run(svc.update_position(pid, {"take_profit": 2405}))
    assert updated["success"] is True
    assert updated["order"]["take_profit"] == 2405.0

    deleted = asyncio.run(svc.delete_position(pid))
    assert deleted["success"] is True


def test_entry_and_tp_sl_rules_still_work():
    svc = SimilatorService(symbol="xag", start_price=2400)

    created = asyncio.run(
        svc.create_position(
            {
                "side": "sell",
                "entry_type": "limit",
                "entry_price": 2401,
                "take_profit": 2398,
                "stop_loss": 2404,
                "volume": 1,
                "symbol": "xag",
            }
        )
    )
    pid = created["order"]["id"]

    entered = asyncio.run(svc.process_price(2401, symbol="xag"))
    assert entered["entered"] == 1

    closed = asyncio.run(svc.process_price(2398, symbol="xag"))
    assert closed["closed"] == 1

    orders = asyncio.run(svc.get_orders())["orders"]
    order = [x for x in orders if x["id"] == pid][0]
    assert order["status"] == "closed"
    assert order["closed_reason"] == "tp"
