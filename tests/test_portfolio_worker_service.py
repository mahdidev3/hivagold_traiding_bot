from pathlib import Path

from workers.bot_portfolio_worker.app.service import PortfolioWorkerService


class DummyConfig:
    DATABASE_PATH = ""
    PRICE_WS_URL = ""
    PRICE_WS_SYMBOL = "xag"
    PRICE_WS_SUBSCRIBE_MESSAGE = "{}"
    BOT_API_KEY = "x"
    MIN_SL_PIPS = 0.1
    MIN_TP_PIPS = 0.1


def test_create_market_order_and_close_tp(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio.db")
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    service.upsert_rule(
        "u1",
        {"name": "r1", "strategy": "fixed", "fixed_volume": 2, "risk_percent": None, "max_open_orders": 2},
    )

    result = service.create_order(
        {
            "user_id": "u1",
            "symbol": "xag",
            "side": "buy",
            "entry_type": "market",
            "entry_price": 10.0,
            "take_profit": 12.0,
            "stop_loss": 8.0,
        }
    )
    assert result["success"] is True

    import asyncio

    asyncio.run(service.on_price_tick("xag", 12.0))
    stats = service.user_stats("u1")
    assert stats["wins"] == 1
    assert stats["closed_orders"] == 1


def test_pending_order_enters_then_sl(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio2.db")
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    service.upsert_rule(
        "u2",
        {"name": "r2", "strategy": "fixed", "fixed_volume": 1, "risk_percent": None, "max_open_orders": 1},
    )
    service.create_order(
        {
            "user_id": "u2",
            "symbol": "xag",
            "side": "sell",
            "entry_type": "limit",
            "entry_price": 10.0,
            "take_profit": 9.0,
            "stop_loss": 11.0,
        }
    )

    import asyncio

    asyncio.run(service.on_price_tick("xag", 10.0))
    asyncio.run(service.on_price_tick("xag", 11.0))
    stats = service.user_stats("u2")
    assert stats["losses"] == 1
