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
        mobile="09120000000",
        password="secret",
        domain="https://hivagold.com",
        strategy="ema_wall_v1",
        active=False,
    )
    key = service._user_key(bot.mobile, bot.domain)
    service._bot_configs[key] = bot

    activated = await service.process({"action": "activate_bot", "mobile": bot.mobile, "domain": bot.domain})
    assert activated["success"] is True
    bot_id = activated["result"]["bot_id"]
    assert bot_id
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
