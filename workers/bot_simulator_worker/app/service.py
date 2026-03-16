import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse
from uuid import uuid4

import websockets

from config import Config


class SimulatorWorkerService:
    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self.root = Path(config.USERS_STORAGE_DIR) / "simulator"
        self.tasks_dir = self.root / "tasks"
        self.positions_dir = self.root / "positions"
        self._lock = asyncio.Lock()
        self._running = False
        self._ws_tasks: dict[str, asyncio.Task] = {}
        self._tasks: dict[str, dict[str, Any]] = {}
        self._positions: dict[str, dict[str, Any]] = {}

    async def start(self):
        self._running = True
        self._load_all()
        for task in self._tasks.values():
            if task.get("status") == "open":
                await self._ensure_price_stream(task["id"])

    async def stop(self):
        self._running = False
        for task in list(self._ws_tasks.values()):
            task.cancel()
        for task in list(self._ws_tasks.values()):
            try:
                await task
            except BaseException:
                pass
        self._ws_tasks.clear()

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _load_json(self, path: Path, default: Any) -> Any:
        if not path.exists():
            return default
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default

    def _save_json(self, path: Path, data: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _load_all(self) -> None:
        self._tasks.clear()
        self._positions.clear()
        for path in self.tasks_dir.glob("*.json"):
            task = self._load_json(path, {})
            if isinstance(task, dict) and task.get("id"):
                self._tasks[str(task["id"])] = task
        for path in self.positions_dir.glob("*.json"):
            position = self._load_json(path, {})
            if isinstance(position, dict) and position.get("id"):
                self._positions[str(position["id"])] = position

    def _task_file(self, task_id: str) -> Path:
        return self.tasks_dir / f"{task_id}.json"

    def _position_file(self, position_id: str) -> Path:
        return self.positions_dir / f"{position_id}.json"

    def _new_task_id(self, portfolio_id: str, user_id: str, market: str) -> str:
        return f"{portfolio_id}-{user_id}-{market}-{uuid4().hex[:8]}"

    def _new_position_id(self, task_id: str) -> str:
        return f"{task_id}-pos-{uuid4().hex[:6]}"

    def _calc_pnl(self, side: str, open_price: float, close_price: float, units: float) -> float:
        direction = 1 if side == "buy" else -1
        return round((close_price - open_price) * direction * units, 4)

    def _ws_url(self, domain: str, market: str) -> str:
        parsed = urlparse(domain if "://" in domain else f"https://{domain}")
        scheme = "wss" if parsed.scheme == "https" else "ws"
        path = self.config.WS_PRICE_PATH_TEMPLATE.format(market=market)
        return f"{scheme}://{parsed.netloc}{path}"

    def _ws_subscribe_message(self, market: str) -> dict[str, Any]:
        return {
            "action": "SubAdd",
            "subs": [f"0~hivagold~{market}~gold"],
        }

    async def create_task(self, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            portfolio_id = str(payload["portfolio_id"]).strip()
            user_id = str(payload["user_id"]).strip()
            market = str(payload["market"]).strip().lower()
            task_id = self._new_task_id(portfolio_id, user_id, market)
            now = self._now()
            task = {
                "id": task_id,
                "portfolio_id": portfolio_id,
                "user_id": user_id,
                "market": market,
                "domain": payload.get("domain"),
                "initial_units": float(payload["initial_units"]),
                "available_units": float(payload["initial_units"]),
                "status": "open",
                "thread_name": f"sim-task-{task_id}",
                "created_at": now,
                "updated_at": now,
                "last_price": None,
                "last_price_source": None,
            }
            self._tasks[task_id] = task
            self._save_json(self._task_file(task_id), task)

        await self._ensure_price_stream(task_id)
        return task

    async def close_task(self, task_id: str, reason: str) -> dict[str, Any]:
        async with self._lock:
            task = self._tasks.get(task_id)
            if not task:
                raise ValueError("simulation task not found")
            task["status"] = "closed"
            task["closed_reason"] = reason or "manual"
            task["updated_at"] = self._now()
            self._save_json(self._task_file(task_id), task)
        ws_task = self._ws_tasks.pop(task_id, None)
        if ws_task:
            ws_task.cancel()
        return task

    async def create_position(self, task_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            task = self._tasks.get(task_id)
            if not task or task.get("status") != "open":
                raise ValueError("simulation task not found or closed")
            units = float(payload.get("units") or 1.0)
            if units > float(task.get("available_units") or 0):
                raise ValueError("not enough available units in simulation task")
            now = self._now()
            entry_type = payload.get("entry_type", "market")
            entry_price = payload.get("entry_price")
            opened_price = None
            if entry_type == "market":
                if task.get("last_price") is not None:
                    opened_price = float(task["last_price"])
                elif entry_price is not None:
                    opened_price = float(entry_price)
            status = "open" if opened_price is not None else "pending"
            position_id = self._new_position_id(task_id)
            position = {
                "id": position_id,
                "task_id": task_id,
                "portfolio_id": task["portfolio_id"],
                "user_id": task["user_id"],
                "market": task["market"],
                "strategy": payload.get("strategy", "manual"),
                "side": payload["side"],
                "entry_type": entry_type,
                "entry_price": float(entry_price) if entry_price is not None else None,
                "opened_price": opened_price,
                "closed_price": None,
                "take_profit": float(payload["take_profit"]),
                "stop_loss": float(payload["stop_loss"]),
                "units": units,
                "status": status,
                "pnl": None,
                "closed_reason": None,
                "created_at": now,
                "updated_at": now,
            }
            task["available_units"] = round(float(task["available_units"]) - units, 4)
            task["updated_at"] = now
            self._positions[position_id] = position
            self._save_json(self._position_file(position_id), position)
            self._save_json(self._task_file(task_id), task)
            return position

    async def update_position(self, position_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            position = self._positions.get(position_id)
            if not position:
                raise ValueError("position not found")
            if position.get("status") == "closed":
                raise ValueError("closed position can not be updated")
            for field in ("take_profit", "stop_loss", "entry_price", "units"):
                if payload.get(field) is not None:
                    position[field] = float(payload[field])
            position["updated_at"] = self._now()
            self._save_json(self._position_file(position_id), position)
            return position

    async def change_stop_loss(self, position_id: str, stop_loss: float) -> dict[str, Any]:
        return await self.update_position(position_id, {"stop_loss": stop_loss})

    async def close_position(self, position_id: str, close_price: Optional[float], reason: str) -> dict[str, Any]:
        async with self._lock:
            position = self._positions.get(position_id)
            if not position:
                raise ValueError("position not found")
            if position.get("status") == "closed":
                return position
            task = self._tasks.get(str(position["task_id"]))
            if not task:
                raise ValueError("task not found for position")
            price = close_price if close_price is not None else task.get("last_price")
            if price is None:
                raise ValueError("close_price is required when no market price is available")
            if position.get("opened_price") is None:
                position["opened_price"] = float(position.get("entry_price") or price)
            position["closed_price"] = float(price)
            position["status"] = "closed"
            position["closed_reason"] = reason or "manual"
            position["pnl"] = self._calc_pnl(position["side"], float(position["opened_price"]), float(price), float(position.get("units") or 1.0))
            position["updated_at"] = self._now()
            task["available_units"] = round(float(task["available_units"]) + float(position.get("units") or 1.0), 4)
            task["updated_at"] = self._now()
            self._save_json(self._position_file(position_id), position)
            self._save_json(self._task_file(task["id"]), task)
            return position

    async def process_price_tick(self, task_id: str, market: str, price: float, source: str = "api") -> dict[str, Any]:
        async with self._lock:
            task = self._tasks.get(task_id)
            if not task:
                raise ValueError("simulation task not found")
            if task.get("market") != market:
                return {"task_id": task_id, "ignored": True, "reason": "market_mismatch"}
            task["last_price"] = float(price)
            task["last_price_source"] = source
            task["updated_at"] = self._now()
            entered = 0
            closed = 0
            for position in self._positions.values():
                if position.get("task_id") != task_id or position.get("status") not in {"pending", "open"}:
                    continue
                side = position.get("side")
                entry_price = position.get("entry_price")
                if position.get("status") == "pending":
                    can_enter = entry_price is None or (price <= entry_price if side == "buy" else price >= entry_price)
                    if can_enter:
                        position["status"] = "open"
                        position["opened_price"] = float(price)
                        position["updated_at"] = self._now()
                        entered += 1
                        self._save_json(self._position_file(position["id"]), position)
                if position.get("status") == "open" and position.get("opened_price") is not None:
                    tp, sl = float(position["take_profit"]), float(position["stop_loss"])
                    hit_reason = None
                    if side == "buy":
                        if price >= tp:
                            hit_reason = "tp"
                        elif price <= sl:
                            hit_reason = "sl"
                    else:
                        if price <= tp:
                            hit_reason = "tp"
                        elif price >= sl:
                            hit_reason = "sl"
                    if hit_reason:
                        position["status"] = "closed"
                        position["closed_price"] = float(price)
                        position["closed_reason"] = hit_reason
                        position["pnl"] = self._calc_pnl(side, float(position["opened_price"]), float(price), float(position.get("units") or 1.0))
                        position["updated_at"] = self._now()
                        task["available_units"] = round(float(task["available_units"]) + float(position.get("units") or 1.0), 4)
                        closed += 1
                        self._save_json(self._position_file(position["id"]), position)
            self._save_json(self._task_file(task_id), task)
            return {"task_id": task_id, "price": float(price), "entered": entered, "closed": closed, "market": market, "source": source}

    def task_info(self, task_id: str) -> dict[str, Any]:
        task = self._tasks.get(task_id)
        if not task:
            raise ValueError("simulation task not found")
        positions = [p for p in self._positions.values() if p.get("task_id") == task_id]
        return {"task": task, "positions": positions}

    def all_records(self) -> dict[str, Any]:
        return {
            "tasks": sorted(self._tasks.values(), key=lambda item: item.get("created_at", "")),
            "positions": sorted(self._positions.values(), key=lambda item: item.get("created_at", "")),
            "count_tasks": len(self._tasks),
            "count_positions": len(self._positions),
        }

    async def _ensure_price_stream(self, task_id: str) -> None:
        if task_id in self._ws_tasks and not self._ws_tasks[task_id].done():
            return
        if not self._running:
            return
        task = self._tasks.get(task_id)
        if not task or not task.get("domain"):
            return
        self._ws_tasks[task_id] = asyncio.create_task(self._price_ws_loop(task_id), name=f"sim-task-{task_id}")

    async def _price_ws_loop(self, task_id: str) -> None:
        while self._running:
            task = self._tasks.get(task_id)
            if not task or task.get("status") != "open":
                return
            domain = task.get("domain")
            if not domain:
                return
            try:
                ws_url = self._ws_url(domain, task["market"])
                subscribe_message = self._ws_subscribe_message(task["market"])
                parsed = urlparse(domain if "://" in domain else f"https://{domain}")
                origin = f"{parsed.scheme}://{parsed.netloc}"
                async with websockets.connect(ws_url, origin=origin, ping_interval=None, ping_timeout=None) as ws:
                    await ws.send(json.dumps(subscribe_message, ensure_ascii=False))
                    async for raw in ws:
                        if not self._running:
                            break
                        try:
                            payload = json.loads(raw)
                        except Exception:
                            continue
                        price = payload.get("price")
                        if price is None and isinstance(payload.get("data"), dict):
                            price = payload["data"].get("price")
                        if price is None:
                            continue
                        await self.process_price_tick(task_id, task["market"], float(price), source="websocket")
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.warning("[SIMULATOR] ws reconnect task=%s error=%s", task_id, exc)
                await asyncio.sleep(2)
