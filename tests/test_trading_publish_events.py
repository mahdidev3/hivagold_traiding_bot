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
    USERS_STORAGE_DIR = "workers/bot_auth_worker/Users"
    ROOM_PREFIX = "/xag"
    BARS_SYMBOL = "xag"
    WS_LIVE_BARS_PATH = "/xag/ws/xag/live-bars/"
    WS_PRICE_PATH = "/xag/ws/xag/price/"
    WS_WALL_PATH = "/xag/ws/xag/wall/"
    WS_EXTERNAL_PRICE_URL = ""


async def _run_test_event_publish():
    service = TradingWorkerService(DummyConfig(), DummySessionStore(), DummyMarket(), DummyExec())
    event = {"domain": "d", "mobile": "m", "event": "price", "payload": {"price": 1}}
    await service._publish_event(event)
    latest = service.latest_signals()
    assert len(latest) == 1
    assert latest[0]["payload"]["price"] == 1


def test_publish_event_updates_latest_event_cache():
    asyncio.run(_run_test_event_publish())
