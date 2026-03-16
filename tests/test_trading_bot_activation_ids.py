import asyncio

from workers.bot_trading_worker.app.service import BotThreadConfig, TradingWorkerService


class DummySessionStore:
    pass


class DummyMarket:
    pass


class DummyExec:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"


async def _run_activation_id_flow_test():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())

    async def idle_run_bot(_bot):
        await asyncio.sleep(3600)

    service._run_bot = idle_run_bot
    bot = BotThreadConfig(
        user_id="u-1",
        portfolio_id="p-1",
        market="xag",
        mobile="09120000000",
        password="secret",
        domain="https://hivagold.com",
        strategy="ema_wall_v1",
        task_id="task-fixed",
        active=False,
    )
    bot_id = service._new_bot_id()
    service._bot_configs[bot_id] = bot

    activated = await service.process({"action": "activate_bot", "task_id": bot.task_id})
    assert activated["success"] is True
    activated_bot_id = activated["result"]["bot_id"]
    assert activated_bot_id == bot_id
    assert activated["result"]["strategy"] == "ema_wall_v1"

    status = await service.process({"action": "status"})
    assert status["success"] is True
    assert status["result"]["active_bots"][0]["strategy"] == "ema_wall_v1"
    assert status["result"]["active_bots"][0]["bot_id"] == bot_id

    listed = await service.process({"action": "list_bots"})
    assert listed["success"] is True
    assert listed["result"]["bots"][0]["bot_id"] == bot_id

    deactivated = await service.process({"action": "deactivate_bot", "bot_id": bot_id})
    assert deactivated["success"] is True
    assert deactivated["result"]["active"] is False
    assert deactivated["result"]["bot_id"] == bot_id

    await asyncio.sleep(0)


def test_activate_and_deactivate_bot_by_id_with_strategy_visibility():
    asyncio.run(_run_activation_id_flow_test())
