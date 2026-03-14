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


def test_db_records_and_admin_all_data(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio3.db")
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

    records = service.db_records()
    assert records["counts"]["portfolios"] == 1
    assert records["counts"]["positions"] == 1

    pnl_positions = service.strategy_pnl_positions("ema_wall_v1")
    assert pnl_positions["strategy"] == "ema_wall_v1"
    assert len(pnl_positions["positions"]) == 1

    admin_data = service.admin_all_data()
    assert "db" in admin_data
    assert "ema_wall_v1" in admin_data["strategies"]


def test_price_tick_updates_only_matching_symbol(tmp_path: Path):
    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(tmp_path / "portfolio4.db")
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    for symbol in ("xag", "xau"):
        asyncio.run(
            service.on_market_event(
                {
                    "event": "signal",
                    "payload": {
                        "strategy": "ema_wall_v1",
                        "symbol": symbol,
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

    asyncio.run(service.on_market_event({"event": "price", "payload": {"price": 12.0, "symbol": "xag"}}))

    positions = service.list_positions("ema_wall_v1")
    xag = [p for p in positions if p["symbol"] == "xag"][0]
    xau = [p for p in positions if p["symbol"] == "xau"][0]

    assert xag["status"] == "closed"
    assert xau["status"] == "open"


def test_db_migration_adds_symbol_column(tmp_path: Path):
    db_path = tmp_path / "portfolio_legacy.db"
    import sqlite3

    conn = sqlite3.connect(db_path)
    conn.executescript(
        """
        CREATE TABLE strategy_positions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            strategy TEXT NOT NULL,
            side TEXT NOT NULL,
            status TEXT NOT NULL,
            entry_type TEXT NOT NULL,
            entry_price REAL,
            opened_price REAL,
            closed_price REAL,
            take_profit REAL NOT NULL,
            stop_loss REAL NOT NULL,
            volume REAL NOT NULL,
            pnl REAL,
            closed_reason TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        """
    )
    conn.close()

    cfg = DummyConfig()
    cfg.DATABASE_PATH = str(db_path)
    service = PortfolioWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    service._init_db()

    conn = sqlite3.connect(db_path)
    columns = [row[1] for row in conn.execute("PRAGMA table_info(strategy_positions)").fetchall()]
    conn.close()

    assert "symbol" in columns
