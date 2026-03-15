import asyncio

from workers.bot_trading_worker.app.service import TradingWorkerService


class DummyRedis:
    def __init__(self):
        self.calls = []

    def publish_event(self, channel: str, event: dict) -> int:
        self.calls.append((channel, event))
        return 1


class DummyMarket:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"
    ROOM_PREFIX = "/xag"
    MARKET_EVENT_CHANNEL = "bot.market.events"
    BARS_SYMBOL = "xag"


class DummyUser:
    mobile = "0912"
    domain = "https://demo.hivagold.com"


async def _run_test_market_publish():
    redis_client = DummyRedis()
    service = TradingWorkerService(DummyConfig(), redis_client, DummyMarket())
    await service._publish_market_event(DummyUser(), "price", {"price": 100})
    assert redis_client.calls
    channel, event = redis_client.calls[0]
    assert channel == DummyConfig.MARKET_EVENT_CHANNEL
    assert event["event"] == "price"


async def _run_test_signal_publish():
    redis_client = DummyRedis()
    service = TradingWorkerService(DummyConfig(), redis_client, DummyMarket())
    signal = {"domain": "d", "mobile": "m", "strategy": "s", "status": "signal"}
    await service._publish_signal(signal)
    assert redis_client.calls
    _, event = redis_client.calls[0]
    assert event["event"] == "signal"
    assert event["payload"] == signal


def test_publish_market_event_uses_publish_event_api():
    asyncio.run(_run_test_market_publish())


def test_publish_signal_uses_publish_event_api():
    asyncio.run(_run_test_signal_publish())
