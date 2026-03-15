import asyncio
import json
from pathlib import Path

from workers.bot_simulator_worker.app.service import SimulatorWorkerService


class DummyConfig:
    USERS_STORAGE_DIR = ""
    SIMULATOR_HISTORY_FILE = "SimulatorHistory.json"
    PRICE_WS_SYMBOL = "xag"
    WS_PRICE_PATH = "/xag/ws/xag/price/"
    PRICE_WS_SUBSCRIBE_MESSAGE = '{"action":"SubAdd","subs":["0~hivagold~xag~gold"]}'


def _write_user_info(root: Path, mobile: str):
    user_dir = root / mobile
    user_dir.mkdir(parents=True, exist_ok=True)
    (user_dir / "User_info.json").write_text(
        json.dumps({"sessions": {"demo.hivagold.com": {"cookies": {"sessionid": "x"}, "headers": {"User-Agent": "t"}}}}),
        encoding="utf-8",
    )


def test_create_and_close_position(tmp_path: Path):
    cfg = DummyConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path / "Users")
    _write_user_info(Path(cfg.USERS_STORAGE_DIR), "0912")

    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    asyncio.run(service.start())
    created = asyncio.run(
        service.create_position(
            {
                "mobile": "0912",
                "side": "buy",
                "entry_type": "market",
                "entry_price": 10.0,
                "take_profit": 12.0,
                "stop_loss": 8.0,
                "volume": 1,
                "domain": "https://demo.hivagold.com",
            }
        )
    )

    assert created["status"] in {"open", "pending"}
    asyncio.run(service.process_price_tick("0912", 12.0, "xag"))
    stats = service.user_stats("0912")
    assert stats["closed_positions"] == 1
    assert stats["wins"] == 1
    asyncio.run(service.stop())


def test_update_and_history(tmp_path: Path):
    cfg = DummyConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path / "Users")
    _write_user_info(Path(cfg.USERS_STORAGE_DIR), "0913")

    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    created = asyncio.run(
        service.create_position(
            {
                "mobile": "0913",
                "side": "sell",
                "entry_type": "limit",
                "entry_price": 10.0,
                "take_profit": 9.0,
                "stop_loss": 11.0,
                "volume": 1,
            }
        )
    )
    updated = asyncio.run(service.update_position("0913", created["id"], {"take_profit": 8.5}))
    assert updated["take_profit"] == 8.5

    history = service.user_history("0913")
    assert len(history["positions"]) == 1
    assert history["positions"][0]["id"] == created["id"]


def test_records_aggregate_multiple_users(tmp_path: Path):
    cfg = DummyConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path / "Users")
    _write_user_info(Path(cfg.USERS_STORAGE_DIR), "0914")
    _write_user_info(Path(cfg.USERS_STORAGE_DIR), "0915")
    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("t"))

    asyncio.run(service.create_position({"mobile": "0914", "side": "buy", "entry_type": "market", "entry_price": 10.0, "take_profit": 12.0, "stop_loss": 8.0, "volume": 1}))
    asyncio.run(service.create_position({"mobile": "0915", "side": "buy", "entry_type": "market", "entry_price": 10.0, "take_profit": 12.0, "stop_loss": 8.0, "volume": 1}))

    records = service.all_records()
    assert records["count_users"] >= 2
    assert "0914" in records["users"]
