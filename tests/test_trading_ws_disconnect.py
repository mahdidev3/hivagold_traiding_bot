import asyncio

from workers.bot_trading_worker.app.service import TradingWorkerService


class DummyRedis:
    pass


class DummyMarket:
    pass


class DummyConfig:
    USERS_JSON_PATH = "workers/bot_trading_worker/users.json"
    ROOM_PREFIX = "/xag"


class DummyUser:
    mobile = "0912"
    domain = "https://hivagold.com"


async def _run_test():
    service = TradingWorkerService(DummyConfig(), DummyRedis(), DummyMarket())
    published = []

    async def fake_publish(signal: dict):
        published.append(signal)

    service._publish_signal = fake_publish
    await service._on_ws_disconnect(DummyUser(), "price", "closed: 1006")
    assert published
    assert published[0]["status"] == "ws_disconnected"


def test_on_ws_disconnect_publishes_signal():
    asyncio.run(_run_test())
