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
    USERS_STORAGE_DIR = "workers/bot_auth_worker/Users"
    ROOM_PREFIX = "/xag"
    BARS_SYMBOL = "xag"
    WS_LIVE_BARS_PATH = "/xag/ws/xag/live-bars/"
    WS_PRICE_PATH = "/xag/ws/xag/price/"
    WS_WALL_PATH = "/xag/ws/xag/wall/"
    WS_EXTERNAL_PRICE_URL = ""


async def _run_test():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
    published = []

    async def fake_publish(event: dict):
        published.append(event)

    service._publish_event = fake_publish
    bot = BotThreadConfig(mobile="0912", password="x", domain="https://hivagold.com")
    await service._on_ws_disconnect(bot, "price", "closed: 1006")
    assert published
    assert published[0]["event"] == "ws_disconnected"


def test_on_ws_disconnect_publishes_event():
    asyncio.run(_run_test())
