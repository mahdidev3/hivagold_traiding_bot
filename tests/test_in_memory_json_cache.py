import asyncio
import json
from pathlib import Path

from workers.bot_simulator_worker.app.service import SimulatorWorkerService
from workers.bot_trading_worker.app.clients import SessionStore


class SimulatorConfig:
    USERS_STORAGE_DIR = ""
    WS_PRICE_PATH_TEMPLATE = "/{market}/ws/{market}/price/"


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


def test_simulator_writes_records_to_json(tmp_path):
    cfg = SimulatorConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path)
    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("test"))

    async def run_case():
        task = await service.create_task({"portfolio_id": "p1", "user_id": "u1", "market": "xag", "initial_units": 2})
        await service.process_price_tick(task["id"], "xag", 2500.0)

    asyncio.run(run_case())

    task_files = list((Path(cfg.USERS_STORAGE_DIR) / "simulator" / "tasks").glob("*.json"))
    assert len(task_files) == 1
