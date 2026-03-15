import asyncio
import json
from pathlib import Path

from workers.bot_simulator_worker.app.service import SimulatorWorkerService
from workers.bot_trading_worker.app.clients import SessionStore


class SimulatorConfig:
    USERS_STORAGE_DIR = ""
    SIMULATOR_HISTORY_FILE = "history.json"
    SIMULATOR_HISTORY_FLUSH_INTERVAL_SECONDS = 60
    PRICE_WS_SYMBOL = "xag"
    WS_PRICE_PATH = "/ws/price"
    PRICE_WS_SUBSCRIBE_MESSAGE = '{"action":"sub"}'


def test_trading_session_store_uses_memory_cache(tmp_path, monkeypatch):
    mobile = "09120000000"
    users_root = tmp_path
    user_dir = users_root / mobile
    user_dir.mkdir(parents=True)
    user_file = user_dir / "User_info.json"
    user_file.write_text(json.dumps({"sessions": {"hivagold.com": {"cookies": {"sessionid": "abc"}, "headers": {}}}}), encoding="utf-8")

    store = SessionStore(str(users_root))
    first = store.get_session_data(mobile, "hivagold.com")
    assert first and first["cookies"]["sessionid"] == "abc"

    def fail_json_load(*args, **kwargs):
        raise RuntimeError("json.load should not be called when cache is hot")

    monkeypatch.setattr("workers.bot_trading_worker.app.clients.json.load", fail_json_load)
    second = store.get_session_data(mobile, "hivagold.com")
    assert second and second["cookies"]["sessionid"] == "abc"


def test_simulator_history_write_is_throttled(tmp_path):
    cfg = SimulatorConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path)
    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("test"))

    writes = 0
    original_write = service._write_json

    def counted_write(path: Path, data):
        nonlocal writes
        writes += 1
        return original_write(path, data)

    service._write_json = counted_write

    async def run_case():
        await service.process_price_tick("09120000000", 2500.0)
        await service.process_price_tick("09120000000", 2501.0)

    asyncio.run(run_case())
    assert writes == 1
