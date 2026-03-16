import asyncio

from workers.bot_trading_worker.app.service import BotThreadConfig, TradingWorkerService


class DummySessionStore:
    def get_session_data(self, mobile, domain):
        return None


class DummyMarket:
    pass


class DummyExec:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"
    WS_EXTERNAL_PRICE_URL = ""


async def _run_once_with_valid_analysis() -> tuple[dict, list[dict]]:
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
    bot = BotThreadConfig(
        user_id="u-1",
        portfolio_id="p-1",
        market="xag",
        strategy="simple_position_test_v1",
        mobile="0912",
        password="x",
        domain="https://hivagold.com",
        metadata={
            "price": 2500,
            "min_price": 2400,
            "max_price": 2700,
            "candles": [{"close": 2490}, {"close": 2500}],
        },
        task_id="task-1",
        simulator_task_id="sim-1",
    )

    called = {"count": 0}

    async def _fake_create_position(config):
        called["count"] += 1
        return {"id": "pos-1", "task_id": config.simulator_task_id}

    service._create_position_for_test_strategy = _fake_create_position  # type: ignore[method-assign]
    task = asyncio.create_task(service._run_bot(bot))
    await asyncio.sleep(0.1)
    task.cancel()
    try:
        await task
    except BaseException:
        pass
    return called, service._task_logs["task-1"]


def test_run_bot_executes_modular_strategy_and_creates_position_once():
    called, logs = asyncio.run(_run_once_with_valid_analysis())
    assert called["count"] == 1
    messages = [item["message"] for item in logs]
    assert "analysis[price_analysis]" in messages
    assert "analysis[candle_analysis]" in messages
    assert "position created" in messages
