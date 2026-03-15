import asyncio
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse

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
        if domain:
            parsed = urlparse(domain if "://" in domain else f"https://{domain}")
            key = (parsed.netloc or parsed.path).lower()
            selected = sessions.get(key)
        if not selected and isinstance(sessions, dict) and sessions:
            selected = next(iter(sessions.values()))
        if not isinstance(selected, dict):
            raise ValueError("No saved login session for user")
        cookies = selected.get("cookies") or {}
        headers = selected.get("headers") or {}
        if not isinstance(cookies, dict) or not cookies:
            raise ValueError("cookies missing in user session file")
        if not isinstance(headers, dict):
            headers = {}
        return cookies, headers, domain

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
        await self._ensure_price_stream(mobile, payload.get("domain"))
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
        return {"mobile": self._normalize_mobile(mobile), "price": float(price), "entered": entered, "closed": closed, "symbol": symbol_value, "source": source}

    def user_history(self, mobile: str) -> dict[str, Any]:
        mobile = self._normalize_mobile(mobile)
        return self._load_history(mobile)

    def user_stats(self, mobile: str) -> dict[str, Any]:
        mobile = self._normalize_mobile(mobile)
        return self._stats(mobile)

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
            result["users"][mobile] = {
                "stats": self.user_stats(mobile),
                "history": self.user_history(mobile),
            }
        result["count_users"] = len(result["users"])
        return result

    async def _ensure_price_stream(self, mobile: str, domain: Optional[str]) -> None:
        if mobile in self._ws_tasks and not self._ws_tasks[mobile].done():
            return
        if not self._running:
            return
        self._ws_tasks[mobile] = asyncio.create_task(self._price_ws_loop(mobile, domain), name=f"sim-ws-{mobile}")

    def _resolve_domain_from_session(self, mobile: str, domain: Optional[str]) -> str:
        if domain:
            return domain
        path = self._session_file(mobile)
        if not path:
            raise ValueError("user session file not found")
        raw = self._read_json(path, {})
        sessions = raw.get("sessions") or {}
        if not sessions:
            raise ValueError("no domain in user session file")
        first = next(iter(sessions.keys()))
        if first.startswith("http://") or first.startswith("https://"):
            return first
        return f"https://{first}"

    def _ws_url(self, domain: str) -> str:
        parsed = urlparse(domain if "://" in domain else f"https://{domain}")
        scheme = "wss" if parsed.scheme == "https" else "ws"
        return f"{scheme}://{parsed.netloc}{self.config.WS_PRICE_PATH}"

    async def _price_ws_loop(self, mobile: str, domain: Optional[str]) -> None:
        while self._running:
            try:
                resolved_domain = self._resolve_domain_from_session(mobile, domain)
                cookies, headers, _ = self._load_user_session(mobile, resolved_domain)
                ws_url = self._ws_url(resolved_domain)
                ws_headers = dict(headers)
                ws_headers["Cookie"] = "; ".join(f"{k}={v}" for k, v in cookies.items())
                origin = f"{urlparse(resolved_domain).scheme}://{urlparse(resolved_domain).netloc}"
                ws_headers.setdefault("User-Agent", "Mozilla/5.0")
                subscribe_message = json.loads(self.config.PRICE_WS_SUBSCRIBE_MESSAGE)

                async with websockets.connect(ws_url, additional_headers=ws_headers, origin=origin, ping_interval=None, ping_timeout=None) as ws:
                    await ws.send(json.dumps(subscribe_message, ensure_ascii=False))
                    self.logger.info("[SIMULATOR] ws connected mobile=%s url=%s", mobile, ws_url)
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
                        try:
                            await self.process_price_tick(mobile, float(price), symbol=self.config.PRICE_WS_SYMBOL, source="websocket")
                        except Exception as exc:
                            self.logger.warning("[SIMULATOR] price tick processing error mobile=%s error=%s", mobile, exc)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.warning("[SIMULATOR] ws reconnect mobile=%s error=%s", mobile, exc)
                await asyncio.sleep(2)
