import asyncio
from pathlib import Path

from workers.bot_simulator_worker.app.service import SimulatorWorkerService


class DummyConfig:
    USERS_STORAGE_DIR = ""
    WS_PRICE_PATH_TEMPLATE = "/{market}/ws/{market}/price/"


def test_task_create_position_and_auto_close(tmp_path: Path):
    cfg = DummyConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path / "Users")

    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    asyncio.run(service.start())

    task = asyncio.run(
        service.create_task(
            {
                "portfolio_id": "p1",
                "user_id": "0912",
                "market": "xag",
                "initial_units": 5,
            }
        )
    )
    position = asyncio.run(
        service.create_position(
            task["id"],
            {
                "side": "buy",
                "entry_type": "market",
                "entry_price": 10.0,
                "take_profit": 12.0,
                "stop_loss": 8.0,
                "units": 1,
            },
        )
    )

    assert position["status"] in {"open", "pending"}
    asyncio.run(service.process_price_tick(task["id"], "xag", 12.0))
    info = service.task_info(task["id"])
    assert any(p["status"] == "closed" for p in info["positions"])

    asyncio.run(service.stop())


def test_update_and_records(tmp_path: Path):
    cfg = DummyConfig()
    cfg.USERS_STORAGE_DIR = str(tmp_path / "Users")

    service = SimulatorWorkerService(cfg, logger=__import__("logging").getLogger("t"))
    task = asyncio.run(
        service.create_task(
            {
                "portfolio_id": "p2",
                "user_id": "0913",
                "market": "mazaneh",
                "initial_units": 3,
            }
        )
    )

    created = asyncio.run(
        service.create_position(
            task["id"],
            {
                "side": "sell",
                "entry_type": "limit",
                "entry_price": 10.0,
                "take_profit": 9.0,
                "stop_loss": 11.0,
                "units": 1,
            },
        )
    )
    updated = asyncio.run(service.update_position(created["id"], {"take_profit": 8.5}))
    assert updated["take_profit"] == 8.5

    records = service.all_records()
    assert records["count_tasks"] == 1
    assert records["count_positions"] == 1
