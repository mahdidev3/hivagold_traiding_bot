import asyncio

from workers.bot_trading_worker.app.service import TradingWorkerService


class DummySessionStore:
    pass


class DummyMarket:
    pass


class DummyExec:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"


async def _run_bot_crud_flow():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())

    async def idle_run_bot(_bot):
        await asyncio.sleep(3600)

    service._run_bot = idle_run_bot

    created = await service.process(
        {
            "action": "create_bot",
            "mobile": "09120000000",
            "password": "secret",
            "domain": "https://hivagold.com",
        }
    )
    assert created["success"] is True
    bot_id = created["result"]["bot_id"]

    started = await service.process({"action": "start_bot", "bot_id": bot_id})
    assert started["success"] is True
    assert started["result"]["active"] is True

    stopped = await service.process({"action": "stop_bot", "bot_id": bot_id})
    assert stopped["success"] is True
    assert stopped["result"]["active"] is False

    removed = await service.process({"action": "remove_bot", "bot_id": bot_id})
    assert removed["success"] is True
    assert removed["result"]["removed"] is True


async def _run_multi_bot_same_market_different_strategy_flow():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())

    async def idle_run_bot(_bot):
        await asyncio.sleep(3600)

    service._run_bot = idle_run_bot

    first = await service.process(
        {
            "action": "create_bot",
            "mobile": "09120000000",
            "password": "secret",
            "domain": "https://hivagold.com",
            "strategy": "ema_wall_v1",
        }
    )
    second = await service.process(
        {
            "action": "create_bot",
            "mobile": "09120000000",
            "password": "secret",
            "domain": "https://hivagold.com",
            "strategy": "pending",
        }
    )

    assert first["success"] is True
    assert second["success"] is True
    assert first["result"]["bot_id"] != second["result"]["bot_id"]

    ambiguous = await service.process(
        {
            "action": "start_bot",
            "mobile": "09120000000",
            "domain": "https://hivagold.com",
        }
    )
    assert ambiguous["success"] is False

    started_first = await service.process({"action": "start_bot", "bot_id": first["result"]["bot_id"]})
    started_second = await service.process({"action": "start_bot", "bot_id": second["result"]["bot_id"]})
    assert started_first["success"] is True
    assert started_second["success"] is True

    status = await service.process({"action": "status"})
    assert status["success"] is True
    assert len(status["result"]["active_bots"]) == 2


def test_create_start_stop_remove_bot_flow():
    asyncio.run(_run_bot_crud_flow())


def test_multiple_bots_same_market_for_same_user_supported():
    asyncio.run(_run_multi_bot_same_market_different_strategy_flow())
