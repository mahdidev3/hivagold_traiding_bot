import asyncio
from pathlib import Path

from workers.bot_portfolio_worker.app.service import PortfolioWorkerService


class DummyConfig:
    DATABASE_PATH = ""
    BOT_API_KEY = "x"
    REDIS_HOST = "localhost"
    REDIS_PORT = 6379
    REDIS_DB = 0
    REDIS_PASSWORD = ""
    REDIS_MARKET_EVENT_CHANNEL = "bot.market.events"


def test_signal_event_creates_position_and_price_closes(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio.db")
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    asyncio.run(
        service.on_market_event(
            {
                "event": "signal",
                "payload": {
                    "strategy": "ema_wall_v1",
                    "status": "signal",
                    "recommendation": {
                        "action": "buy",
                        "ordertype": "market",
                        "price": 10.0,
                        "units": 1,
                        "take_profit": 12.0,
                        "stop_loss": 8.0,
                    },
                },
            }
        )
    )
    asyncio.run(service.process_price_tick(12.0))

    stats = service.strategy_stats("ema_wall_v1")
    assert stats["wins"] == 1
    assert stats["closed_positions"] == 1


def test_pending_position_enters_then_stops(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio2.db")
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    asyncio.run(
        service.on_market_event(
            {
                "event": "signal",
                "payload": {
                    "strategy": "ema_wall_v1",
                    "status": "signal",
                    "recommendation": {
                        "action": "sell",
                        "ordertype": "limit",
                        "price": 10.0,
                        "units": 1,
                        "take_profit": 9.0,
                        "stop_loss": 11.0,
                    },
                },
            }
        )
    )

    asyncio.run(service.process_price_tick(10.0))
    asyncio.run(service.process_price_tick(11.0))
    stats = service.strategy_stats("ema_wall_v1")
    assert stats["losses"] == 1
