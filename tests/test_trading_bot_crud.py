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

    started = await service.process(
        {
            "action": "start_bot",
            "mobile": "09120000000",
            "domain": "https://hivagold.com",
        }
    )
    assert started["success"] is True
    assert started["result"]["active"] is True
    bot_id = started["result"]["bot_id"]

    stopped = await service.process({"action": "stop_bot", "bot_id": bot_id})
    assert stopped["success"] is True
    assert stopped["result"]["active"] is False

    removed = await service.process({"action": "remove_bot", "mobile": "09120000000", "domain": "https://hivagold.com"})
    assert removed["success"] is True
    assert removed["result"]["removed"] is True



def test_create_start_stop_remove_bot_flow():
    asyncio.run(_run_bot_crud_flow())
