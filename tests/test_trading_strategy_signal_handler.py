import asyncio

from workers.bot_trading_worker.app.service import BotThreadConfig, TradingWorkerService
from workers.bot_trading_worker.app.strategies.base import StrategySignal


class DummySessionStore:
    pass


class DummyMarket:
    pass


class DummyExec:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"
    BOT_API_KEY = "k"


def test_strategy_signal_handler_uses_method_and_url_from_metadata(monkeypatch):
    async def run_case():
        service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
        bot = BotThreadConfig(
            user_id="u-1",
            portfolio_id="p-1",
            market="xag",
            strategy="simple_position_test_v1",
            mobile="0912",
            password="x",
            domain="https://hivagold.com",
            task_id="task-1",
            simulator_task_id="sim-task-1",
            metadata={
                "execution_api_base": "http://sim:8007",
                "position_open_method": "POST",
                "position_open_url": "/simulator/tasks/sim-task-1/positions",
            },
        )

        calls = {}

        def fake_request(method, url, json, headers, timeout):
            calls["method"] = method
            calls["url"] = url
            calls["json"] = json
            calls["headers"] = headers

            class Response:
                def raise_for_status(self):
                    return None

                def json(self):
                    return {"success": True, "result": {"id": "p-1"}}

            return Response()

        monkeypatch.setattr("workers.bot_trading_worker.app.service.requests.request", fake_request)

        signal = StrategySignal(
            signal_type="open_position",
            confidence=0.7,
            payload={"side": "buy", "units": 0.2, "take_profit": 2600, "stop_loss": 2400},
        )
        result = await service._handle_strategy_signal(bot, signal)

        assert result["success"] is True
        assert calls["method"] == "POST"
        assert calls["url"] == "http://sim:8007/simulator/tasks/sim-task-1/positions"

    asyncio.run(run_case())
