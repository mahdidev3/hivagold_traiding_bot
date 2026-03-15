import asyncio
import json
import logging
import random
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse

import requests
import websockets

from config import Config


class SimulatorWorkerService:
    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self.users_root = Path(config.USERS_STORAGE_DIR)
        self._lock = asyncio.Lock()
        self._running = False
        self._ws_tasks: dict[str, asyncio.Task] = {}
        self._strategy_tasks: dict[str, dict[str, Any]] = {}
        self._helper_prices: dict[str, float] = {}
        self._hiva_prices: dict[str, float] = {}
        self._helper_candles: dict[str, dict[str, Any]] = {}
        self._active_position_by_task: dict[str, int] = {}

    async def start(self):
        self._running = True

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

    def _normalize_mobile(self, mobile: str) -> str:
        value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
        if value.startswith("0098") and len(value) >= 12:
            value = "0" + value[4:]
        elif value.startswith("98") and len(value) >= 12:
            value = "0" + value[2:]
        elif len(value) == 10 and not value.startswith("0"):
            value = f"0{value}"
        return value

    def _user_dir(self, mobile: str) -> Path:
        return self.users_root / self._normalize_mobile(mobile)

    def _session_file(self, mobile: str) -> Optional[Path]:
        user_dir = self._user_dir(mobile)
        for name in ("User_info.json", "Userinfo.json"):
            candidate = user_dir / name
            if candidate.exists():
                return candidate
        return None

    def _history_file(self, mobile: str) -> Path:
        return self._user_dir(mobile) / self.config.SIMULATOR_HISTORY_FILE

    def _read_json(self, path: Path, default: Any) -> Any:
        if not path.exists():
            return default
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            return default

    def _write_json(self, path: Path, data: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def _load_history(self, mobile: str) -> dict[str, Any]:
        data = self._read_json(self._history_file(mobile), {"positions": [], "last_price": None})
        if not isinstance(data, dict):
            return {"positions": [], "last_price": None}
        if not isinstance(data.get("positions"), list):
            data["positions"] = []
        return data

    def _save_history(self, mobile: str, data: dict[str, Any]) -> None:
        self._write_json(self._history_file(mobile), data)

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _calc_pnl(self, side: str, open_price: float, close_price: float, volume: float) -> float:
        direction = 1 if side == "buy" else -1
        return round((close_price - open_price) * direction * volume, 4)

    def _stats(self, mobile: str) -> dict[str, Any]:
        history = self._load_history(mobile)
        closed = [p for p in history["positions"] if p.get("status") == "closed"]
        wins = len([p for p in closed if (p.get("pnl") or 0) > 0])
        total = sum(float(p.get("pnl") or 0) for p in closed)
        return {
            "mobile": self._normalize_mobile(mobile),
            "closed_positions": len(closed),
            "wins": wins,
            "losses": len(closed) - wins,
            "win_rate": round((wins / len(closed)) * 100, 2) if closed else 0.0,
            "total_pnl": round(total, 4),
            "open_positions": len([p for p in history["positions"] if p.get("status") in {"open", "pending"}]),
        }

    def _load_user_session(self, mobile: str, domain: Optional[str]) -> tuple[dict[str, str], dict[str, str], Optional[str]]:
        path = self._session_file(mobile)
        if not path:
            raise ValueError("User session file not found")
        raw = self._read_json(path, {})
        sessions = raw.get("sessions") or {}
        selected = None
        resolved_domain = domain
        if domain:
            parsed = urlparse(domain if "://" in domain else f"https://{domain}")
            key = (parsed.netloc or parsed.path).lower()
            selected = sessions.get(key)
            resolved_domain = f"{parsed.scheme}://{parsed.netloc}" if parsed.netloc else domain
        if not selected and isinstance(sessions, dict) and sessions:
            first_key, selected = next(iter(sessions.items()))
            if not resolved_domain:
                resolved_domain = first_key if "://" in first_key else f"https://{first_key}"
        if not isinstance(selected, dict):
            raise ValueError("No saved login session for user")
        cookies = selected.get("cookies") or {}
        headers = selected.get("headers") or {}
        if not isinstance(cookies, dict) or not cookies:
            raise ValueError("cookies missing in user session file")
        if not isinstance(headers, dict):
            headers = {}
        return cookies, headers, resolved_domain

    async def create_position(self, payload: dict[str, Any]) -> dict[str, Any]:
        mobile = self._normalize_mobile(payload.get("mobile", ""))
        if not mobile:
            raise ValueError("mobile is required")
        async with self._lock:
            history = self._load_history(mobile)
            positions = history["positions"]
            next_id = (max((int(p.get("id", 0)) for p in positions), default=0) + 1)
            now = self._now()
            entry_type = payload.get("entry_type", "market")
            entry_price = payload.get("entry_price")
            last_price = history.get("last_price")
            opened_price = float(last_price) if entry_type == "market" and last_price is not None else (float(entry_price) if entry_type == "market" and entry_price is not None else None)
            status = "open" if opened_price is not None else "pending"
            pos = {
                "id": next_id,
                "mobile": mobile,
                "domain": payload.get("domain"),
                "strategy": payload.get("strategy", "manual"),
                "symbol": (payload.get("symbol") or self.config.PRICE_WS_SYMBOL).lower(),
                "side": payload["side"],
                "entry_type": entry_type,
                "entry_price": float(entry_price) if entry_price is not None else None,
                "opened_price": opened_price,
                "closed_price": None,
                "take_profit": float(payload["take_profit"]),
                "stop_loss": float(payload["stop_loss"]),
                "volume": float(payload.get("volume") or 1.0),
                "status": status,
                "pnl": None,
                "closed_reason": None,
                "created_at": now,
                "updated_at": now,
            }
            positions.append(pos)
            self._save_history(mobile, history)
        self.logger.info("[SIMULATOR] position created mobile=%s id=%s side=%s", mobile, next_id, pos["side"])
        await self._ensure_hiva_price_stream(mobile, payload.get("domain"), pos["symbol"])
        return pos

    async def update_position(self, mobile: str, position_id: int, payload: dict[str, Any]) -> dict[str, Any]:
        mobile = self._normalize_mobile(mobile)
        async with self._lock:
            history = self._load_history(mobile)
            for pos in history["positions"]:
                if int(pos.get("id", -1)) != int(position_id):
                    continue
                if pos.get("status") == "closed":
                    raise ValueError("closed position can not be updated")
                for field in ("take_profit", "stop_loss", "entry_price", "volume"):
                    if payload.get(field) is not None:
                        pos[field] = float(payload[field])
                pos["updated_at"] = self._now()
                self._save_history(mobile, history)
                self.logger.info("[SIMULATOR] position updated mobile=%s id=%s", mobile, position_id)
                return pos
        raise ValueError("position not found")

    async def close_position(self, mobile: str, position_id: int, close_price: Optional[float], reason: str) -> dict[str, Any]:
        mobile = self._normalize_mobile(mobile)
        async with self._lock:
            history = self._load_history(mobile)
            price = close_price if close_price is not None else history.get("last_price")
            if price is None:
                raise ValueError("close_price is required when no market price is available")
            for pos in history["positions"]:
                if int(pos.get("id", -1)) != int(position_id):
                    continue
                if pos.get("status") == "closed":
                    return pos
                if pos.get("opened_price") is None:
                    pos["opened_price"] = float(pos.get("entry_price") or price)
                pos["closed_price"] = float(price)
                pos["status"] = "closed"
                pos["closed_reason"] = reason or "manual"
                pos["pnl"] = self._calc_pnl(pos["side"], float(pos["opened_price"]), float(price), float(pos.get("volume") or 1.0))
                pos["updated_at"] = self._now()
                self._save_history(mobile, history)
                self.logger.info("[SIMULATOR] position closed mobile=%s id=%s pnl=%s", mobile, position_id, pos["pnl"])
                return pos
        raise ValueError("position not found")

    async def process_price_tick(self, mobile: str, price: float, symbol: Optional[str] = None, source: str = "api") -> dict[str, Any]:
        symbol_value = (symbol or self.config.PRICE_WS_SYMBOL).lower()
        mobile = self._normalize_mobile(mobile)
        async with self._lock:
            history = self._load_history(mobile)
            history["last_price"] = float(price)
            entered = 0
            closed = 0
            for pos in history["positions"]:
                if pos.get("status") not in {"pending", "open"}:
                    continue
                if (pos.get("symbol") or "").lower() != symbol_value:
                    continue
                side = pos.get("side")
                entry_price = pos.get("entry_price")
                if pos.get("status") == "pending":
                    can_enter = entry_price is None or (price <= entry_price if side == "buy" else price >= entry_price)
                    if can_enter:
                        pos["status"] = "open"
                        pos["opened_price"] = float(price)
                        pos["updated_at"] = self._now()
                        entered += 1
                if pos.get("status") == "open" and pos.get("opened_price") is not None:
                    tp, sl = float(pos["take_profit"]), float(pos["stop_loss"])
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
                        pos["status"] = "closed"
                        pos["closed_price"] = float(price)
                        pos["closed_reason"] = hit_reason
                        pos["pnl"] = self._calc_pnl(side, float(pos["opened_price"]), float(price), float(pos.get("volume") or 1.0))
                        pos["updated_at"] = self._now()
                        closed += 1
                        self.logger.info("[SIMULATOR] position auto closed mobile=%s id=%s reason=%s pnl=%s source=%s", mobile, pos.get("id"), hit_reason, pos.get("pnl"), source)
            self._save_history(mobile, history)
        return {"mobile": mobile, "price": float(price), "entered": entered, "closed": closed, "symbol": symbol_value, "source": source}

    def user_history(self, mobile: str) -> dict[str, Any]:
        return self._load_history(self._normalize_mobile(mobile))

    def user_stats(self, mobile: str) -> dict[str, Any]:
        return self._stats(self._normalize_mobile(mobile))

    def all_records(self) -> dict[str, Any]:
        result: dict[str, Any] = {"users": {}}
        if not self.users_root.exists():
            return result
        for user_dir in self.users_root.iterdir():
            if not user_dir.is_dir():
                continue
            mobile = self._normalize_mobile(user_dir.name)
            if not mobile:
                continue
            result["users"][mobile] = {"stats": self.user_stats(mobile), "history": self.user_history(mobile)}
        result["count_users"] = len(result["users"])
        return result

    async def create_strategy_task(self, payload: dict[str, Any]) -> dict[str, Any]:
        mobile = self._normalize_mobile(payload["mobile"])
        room = (payload.get("room") or self.config.PRICE_WS_SYMBOL).lower()
        domain = payload.get("domain")
        task_id = f"{mobile}:{room}:{payload.get('strategy','helper-candle-break-v1')}"
        task = {
            "id": task_id,
            "mobile": mobile,
            "room": room,
            "strategy": payload.get("strategy", "helper-candle-break-v1"),
            "simulation": bool(payload.get("simulation", True)),
            "domain": domain,
            "status": "running",
            "created_at": self._now(),
        }
        self._strategy_tasks[task_id] = task
        await self._ensure_hiva_price_stream(mobile, domain, room)
        await self._ensure_helper_stream(room)
        self.logger.info("[STRATEGY] task created %s", task_id)
        return task

    async def close_strategy_task(self, task_id: str) -> dict[str, Any]:
        task = self._strategy_tasks.pop(task_id, None)
        self._active_position_by_task.pop(task_id, None)
        return {"removed": bool(task), "task_id": task_id}

    def list_tasks(self) -> list[dict[str, Any]]:
        return list(self._strategy_tasks.values())

    async def _ensure_hiva_price_stream(self, mobile: str, domain: Optional[str], room: str) -> None:
        stream_id = f"hiva:{mobile}:{room}"
        if stream_id in self._ws_tasks and not self._ws_tasks[stream_id].done():
            return
        if not self._running:
            return
        self._ws_tasks[stream_id] = asyncio.create_task(self._hiva_price_ws_loop(mobile, domain, room), name=f"sim-hiva-{mobile}-{room}")

    async def _ensure_helper_stream(self, room: str) -> None:
        stream_id = f"helper:{room}"
        if stream_id in self._ws_tasks and not self._ws_tasks[stream_id].done():
            return
        if not self._running:
            return
        self._ws_tasks[stream_id] = asyncio.create_task(self._helper_ws_loop(room), name=f"sim-helper-{room}")

    def _ws_url(self, domain: str) -> str:
        parsed = urlparse(domain if "://" in domain else f"https://{domain}")
        scheme = "wss" if parsed.scheme == "https" else "ws"
        return f"{scheme}://{parsed.netloc}{self.config.WS_PRICE_PATH}"

    async def _hiva_price_ws_loop(self, mobile: str, domain: Optional[str], room: str) -> None:
        while self._running:
            try:
                cookies, headers, resolved_domain = self._load_user_session(mobile, domain)
                if not resolved_domain:
                    raise ValueError("domain is missing")
                ws_url = self._ws_url(resolved_domain)
                ws_headers = dict(headers)
                ws_headers["Cookie"] = "; ".join(f"{k}={v}" for k, v in cookies.items())
                origin = f"{urlparse(resolved_domain).scheme}://{urlparse(resolved_domain).netloc}"
                ws_headers.setdefault("User-Agent", "Mozilla/5.0")
                subscribe_message = json.loads(self.config.PRICE_WS_SUBSCRIBE_MESSAGE)
                async with websockets.connect(ws_url, additional_headers=ws_headers, origin=origin, ping_interval=None, ping_timeout=None) as ws:
                    await ws.send(json.dumps(subscribe_message, ensure_ascii=False))
                    self.logger.info("[SIMULATOR] hivagold ws connected mobile=%s room=%s", mobile, room)
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
                        self._hiva_prices[room] = float(price)
                        await self.process_price_tick(mobile, float(price), symbol=room, source="hivagold_ws")
                        await self._update_strategy_stop_losses(room, float(price))
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.warning("[SIMULATOR] hivagold ws reconnect mobile=%s room=%s error=%s", mobile, room, exc)
                await asyncio.sleep(2)

    async def _helper_ws_loop(self, room: str) -> None:
        while self._running:
            try:
                async with websockets.connect(self.config.HELPER_WS_URL, ping_interval=None, ping_timeout=None) as ws:
                    self.logger.info("[SIMULATOR] helper ws connected room=%s", room)
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
                        await self._handle_helper_tick(room, float(price))
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.warning("[SIMULATOR] helper ws reconnect room=%s error=%s", room, exc)
                await asyncio.sleep(2)

    async def _handle_helper_tick(self, room: str, price: float) -> None:
        self._helper_prices[room] = price
        now = datetime.now(timezone.utc)
        bucket = now.strftime("%Y-%m-%dT%H:%M")
        candle = self._helper_candles.get(room)
        if candle is None or candle["bucket"] != bucket:
            candle = {"bucket": bucket, "open": price, "close": price}
            self._helper_candles[room] = candle
        else:
            candle["close"] = price

        move = candle["close"] - candle["open"]
        if abs(move) < self.config.HELPER_CANDLE_MOVE_THRESHOLD:
            return

        for task_id, task in list(self._strategy_tasks.items()):
            if task["room"] != room:
                continue
            if self._active_position_by_task.get(task_id):
                continue
            hiva_price = self._hiva_prices.get(room)
            if hiva_price is None:
                continue
            side = "buy" if move > 0 else "sell"
            rand_offset = random.uniform(0, self.config.ORDER_TOLERANCE_MAX)
            entry = hiva_price + rand_offset if side == "buy" else hiva_price - rand_offset
            stop_loss = hiva_price
            tp = entry + 5 if side == "buy" else entry - 5
            created = await self.create_position(
                {
                    "mobile": task["mobile"],
                    "domain": task.get("domain"),
                    "strategy": task["strategy"],
                    "symbol": room,
                    "side": side,
                    "entry_type": "limit",
                    "entry_price": round(entry, 4),
                    "take_profit": round(tp, 4),
                    "stop_loss": round(stop_loss, 4),
                    "volume": 1.0,
                }
            )
            self._active_position_by_task[task_id] = int(created["id"])
            self.logger.info("[STRATEGY] signal executed task=%s side=%s helper_move=%.4f", task_id, side, move)

    async def _update_strategy_stop_losses(self, room: str, current_price: float) -> None:
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M")
        for task_id, position_id in list(self._active_position_by_task.items()):
            task = self._strategy_tasks.get(task_id)
            if not task or task["room"] != room:
                continue
            mobile = task["mobile"]
            history = self._load_history(mobile)
            for pos in history["positions"]:
                if int(pos.get("id", -1)) != int(position_id):
                    continue
                if pos.get("status") == "closed":
                    self._active_position_by_task.pop(task_id, None)
                    continue
                updated_at = str(pos.get("updated_at", ""))
                if updated_at.startswith(now):
                    continue
                rand_offset = random.uniform(0, self.config.STOP_TOLERANCE_MAX)
                if pos.get("side") == "sell":
                    pos["stop_loss"] = round(current_price + rand_offset, 4)
                else:
                    pos["stop_loss"] = round(current_price - rand_offset, 4)
                pos["updated_at"] = self._now()
                self._save_history(mobile, history)
                self.logger.info("[STRATEGY] stop loss updated task=%s position=%s sl=%s", task_id, position_id, pos["stop_loss"])

    def fetch_recent_bars(self, mobile: str, room: str, minutes: int = 60) -> list[dict[str, Any]]:
        cookies, headers, domain = self._load_user_session(mobile, None)
        if not domain:
            return []
        parsed = urlparse(domain if "://" in domain else f"https://{domain}")
        url = f"{parsed.scheme}://{parsed.netloc}{self.config.BARS_API_PATH}"
        end_ts = int(datetime.now(timezone.utc).timestamp())
        start_ts = end_ts - max(60, minutes * 60)
        resp = requests.get(
            url,
            params={"symbol": room, "from": start_ts, "to": end_ts, "resolution": "1"},
            headers={**headers, "Cookie": "; ".join(f"{k}={v}" for k, v in cookies.items())},
            timeout=20,
        )
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, dict) and all(k in data for k in ["t", "o", "h", "l", "c"]):
            return [{"ts": int(data["t"][i]), "open": data["o"][i], "high": data["h"][i], "low": data["l"][i], "close": data["c"][i]} for i in range(len(data["t"]))]
        return []
