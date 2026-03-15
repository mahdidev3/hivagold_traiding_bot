import asyncio
import json
import time
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse

import websockets
from websockets.exceptions import ConnectionClosed


def normalize_mobile(mobile: str) -> str:
    value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
    if not value:
        return value
    if value.startswith("0098") and len(value) >= 12:
        value = "0" + value[4:]
    elif value.startswith("98") and len(value) >= 12:
        value = "0" + value[2:]
    elif len(value) == 10 and not value.startswith("0"):
        value = f"0{value}"
    return value


def normalize_domain(domain: str) -> str:
    value = (domain or "").strip()
    if not value:
        return value
    parsed = urlparse(value if "://" in value else f"https://{value}")
    host = parsed.hostname or ""
    if parsed.port:
        host = f"{host}:{parsed.port}"
    return f"{parsed.scheme}://{host}" if host else value.rstrip("/")


class SimilatorService:
    def __init__(self, symbol: str, start_price: float, session_cache_file: str, state_file: str, ws_price_path: str, ws_live_bars_path: str):
        self.symbol = symbol
        self.price = float(start_price)
        self.room_open = True
        self.portfolios: list[dict[str, Any]] = []
        self.positions: list[dict[str, Any]] = []
        self.closed_positions: list[dict[str, Any]] = []
        self.candles: list[dict[str, Any]] = []
        self._next_id = 1
        self._lock = asyncio.Lock()

        self.session_cache_file = Path(session_cache_file)
        self.state_file = Path(state_file)
        self.ws_price_path = ws_price_path
        self.ws_live_bars_path = ws_live_bars_path

        self._stream_task: Optional[asyncio.Task] = None
        self._stream_stop = asyncio.Event()
        self._stream_meta: dict[str, Any] = {"running": False}
        self._load_state()

    def _now(self) -> int:
        return int(time.time())

    def _new_id(self) -> int:
        x = self._next_id
        self._next_id += 1
        return x

    def _load_state(self) -> None:
        if not self.state_file.exists():
            return
        try:
            data = json.loads(self.state_file.read_text(encoding="utf-8"))
        except Exception:
            return
        if not isinstance(data, dict):
            return
        self.price = float(data.get("price", self.price))
        self.portfolios = data.get("portfolios", []) or []
        self.positions = data.get("positions", []) or []
        self.closed_positions = data.get("closed_positions", []) or []
        self.candles = data.get("candles", []) or []
        self._next_id = int(data.get("next_id", self._next_id))

    def _save_state(self) -> None:
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "price": self.price,
            "portfolios": self.portfolios,
            "positions": self.positions,
            "closed_positions": self.closed_positions,
            "candles": self.candles[-500:],
            "next_id": self._next_id,
            "updated_at": self._now(),
        }
        self.state_file.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    async def room_status(self, market: str | None = None) -> dict[str, Any]:
        return {
            "success": True,
            "market": (market or self.symbol),
            "is_open": self.room_open,
            "active": self.room_open,
            "reason": "in_shift" if self.room_open else "out_of_shift",
        }

    async def create_portfolio(self, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            item = {
                "id": self._new_id(),
                "name": payload.get("name") or f"portfolio-{len(self.portfolios)+1}",
                "created_at": self._now(),
                "active": True,
            }
            self.portfolios.append(item)
            self._save_state()
            return {"success": True, "portfolio": item}

    async def list_portfolios(self) -> dict[str, Any]:
        return {"success": True, "portfolios": self.portfolios}

    async def create_position(self, payload: dict[str, Any]) -> dict[str, Any]:
        side = str(payload.get("side", "buy")).lower()
        if side not in {"buy", "sell"}:
            return {"success": False, "error": "invalid side"}
        entry_type = str(payload.get("entry_type", payload.get("ordertype", "market"))).lower()
        if entry_type not in {"market", "limit"}:
            entry_type = "market"
        entry_price = payload.get("entry_price", payload.get("price"))
        take_profit = payload.get("take_profit")
        stop_loss = payload.get("stop_loss")
        if take_profit is None or stop_loss is None:
            return {"success": False, "error": "take_profit and stop_loss are required"}

        async with self._lock:
            status = "open" if entry_type == "market" else "pending"
            pos = {
                "id": self._new_id(),
                "symbol": str(payload.get("symbol") or self.symbol).lower(),
                "side": side,
                "status": status,
                "entry_type": entry_type,
                "entry_price": float(entry_price) if entry_price is not None else None,
                "opened_price": self.price if status == "open" else None,
                "closed_price": None,
                "take_profit": float(take_profit),
                "stop_loss": float(stop_loss),
                "volume": float(payload.get("volume", payload.get("units", 1))),
                "pnl": None,
                "closed_reason": None,
                "created_at": self._now(),
                "updated_at": self._now(),
            }
            self.positions.append(pos)
            self._save_state()
            return {"success": True, "order": pos}

    async def update_position(self, pid: int, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            for pos in self.positions:
                if pos["id"] != pid:
                    continue
                for key in ("take_profit", "stop_loss", "entry_price", "volume", "symbol"):
                    if key in payload and payload[key] is not None:
                        pos[key] = float(payload[key]) if key != "symbol" else str(payload[key]).lower()
                pos["updated_at"] = self._now()
                self._save_state()
                return {"success": True, "order": pos}
        return {"success": False, "error": "order not found"}

    async def delete_position(self, pid: int) -> dict[str, Any]:
        async with self._lock:
            for idx, pos in enumerate(self.positions):
                if pos["id"] == pid:
                    deleted = self.positions.pop(idx)
                    self._save_state()
                    return {"success": True, "deleted": deleted}
        return {"success": False, "error": "order not found"}

    def _should_enter(self, pos: dict[str, Any], price: float) -> bool:
        if pos["entry_price"] is None:
            return True
        return price <= pos["entry_price"] if pos["side"] == "buy" else price >= pos["entry_price"]

    def _close_reason(self, pos: dict[str, Any], price: float) -> str | None:
        if pos["side"] == "buy":
            if price >= pos["take_profit"]:
                return "tp"
            if price <= pos["stop_loss"]:
                return "sl"
        else:
            if price <= pos["take_profit"]:
                return "tp"
            if price >= pos["stop_loss"]:
                return "sl"
        return None

    def _calc_pnl(self, pos: dict[str, Any], close_price: float) -> float:
        opened = float(pos["opened_price"])
        direction = 1 if pos["side"] == "buy" else -1
        return round((close_price - opened) * direction * float(pos["volume"]), 4)

    async def process_price(self, price: float, symbol: str | None = None) -> dict[str, Any]:
        async with self._lock:
            self.price = float(price)
            entered = 0
            closed = 0
            for pos in self.positions:
                if symbol and pos["symbol"] != symbol:
                    continue
                if pos["status"] == "pending" and self._should_enter(pos, self.price):
                    pos["status"] = "open"
                    pos["opened_price"] = self.price
                    pos["updated_at"] = self._now()
                    entered += 1
                    continue
                if pos["status"] != "open" or pos["opened_price"] is None:
                    continue
                reason = self._close_reason(pos, self.price)
                if reason:
                    pos["status"] = "closed"
                    pos["closed_price"] = self.price
                    pos["closed_reason"] = reason
                    pos["pnl"] = self._calc_pnl(pos, self.price)
                    pos["updated_at"] = self._now()
                    self.closed_positions.append(pos.copy())
                    closed += 1
            self._save_state()
            return {"success": True, "entered": entered, "closed": closed, "price": self.price, "symbol": symbol}

    async def close_position(self, pid: int) -> dict[str, Any]:
        async with self._lock:
            for pos in self.positions:
                if pos["id"] == pid and pos["status"] != "closed":
                    pos["status"] = "closed"
                    pos["closed_price"] = self.price
                    pos["closed_reason"] = "manual"
                    if pos["opened_price"] is not None:
                        pos["pnl"] = self._calc_pnl(pos, self.price)
                    pos["updated_at"] = self._now()
                    self.closed_positions.append(pos.copy())
                    self._save_state()
                    return {"success": True, "order": pos}
        return {"success": False, "error": "order not found"}

    async def close_all_in_portfolio(self) -> dict[str, Any]:
        closed = 0
        async with self._lock:
            for pos in self.positions:
                if pos["status"] == "closed":
                    continue
                pos["status"] = "closed"
                pos["closed_price"] = self.price
                pos["closed_reason"] = "portfolio_close"
                if pos["opened_price"] is not None:
                    pos["pnl"] = self._calc_pnl(pos, self.price)
                pos["updated_at"] = self._now()
                self.closed_positions.append(pos.copy())
                closed += 1
            self._save_state()
        return {"success": True, "closed": closed}

    async def get_orders(self) -> dict[str, Any]:
        return {"success": True, "orders": self.positions}

    async def get_transactions(self) -> dict[str, Any]:
        return {"success": True, "transactions": self.closed_positions}

    async def generate_candles(self) -> list[dict[str, Any]]:
        return self.candles[-120:]

    def _load_auth_session(self, mobile: str, domain: str) -> Optional[dict[str, Any]]:
        if not self.session_cache_file.exists():
            return None
        try:
            data = json.loads(self.session_cache_file.read_text(encoding="utf-8"))
        except Exception:
            return None
        if not isinstance(data, dict):
            return None

        mobile_candidates = [normalize_mobile(mobile), (mobile or "").strip()]
        normalized_domain = normalize_domain(domain)
        domain_host = urlparse(normalized_domain).netloc
        domain_candidates = [domain_host, domain_host.split(":")[0], domain.strip(), normalized_domain]
        for d in domain_candidates:
            for m in mobile_candidates:
                if not d or not m:
                    continue
                item = data.get(f"{d}:{m}")
                if not item:
                    continue
                login_data = item.get("login_data") if isinstance(item, dict) else item
                if isinstance(login_data, dict):
                    return login_data
        return None

    def _cookie_header(self, cookies: dict[str, Any]) -> str:
        return "; ".join(f"{k}={v}" for k, v in cookies.items() if k and v is not None)

    def _ws_urls(self, domain: str) -> tuple[str, str]:
        normalized = normalize_domain(domain)
        parsed = urlparse(normalized)
        ws_scheme = "wss" if parsed.scheme == "https" else "ws"
        base = f"{ws_scheme}://{parsed.netloc}"
        return f"{base}{self.ws_price_path}", f"{base}{self.ws_live_bars_path}"

    async def _consume_price(self, ws_url: str, ws_headers: dict[str, str], symbol: str):
        while not self._stream_stop.is_set():
            try:
                async with websockets.connect(ws_url, additional_headers=ws_headers, origin=ws_headers.get("Origin")) as ws:
                    async for raw in ws:
                        if self._stream_stop.is_set():
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
                        await self.process_price(float(price), symbol=symbol)
            except ConnectionClosed:
                await asyncio.sleep(2)
            except Exception:
                await asyncio.sleep(3)

    async def _consume_candles(self, ws_url: str, ws_headers: dict[str, str]):
        while not self._stream_stop.is_set():
            try:
                async with websockets.connect(ws_url, additional_headers=ws_headers, origin=ws_headers.get("Origin")) as ws:
                    async for raw in ws:
                        if self._stream_stop.is_set():
                            break
                        try:
                            payload = json.loads(raw)
                        except Exception:
                            continue
                        data = payload.get("data") if isinstance(payload, dict) else None
                        source = data if isinstance(data, dict) else payload
                        if not isinstance(source, dict):
                            continue
                        if all(k in source for k in ["ts", "open", "high", "low", "close"]):
                            bar = {
                                "ts": int(source["ts"]),
                                "open": float(source["open"]),
                                "high": float(source["high"]),
                                "low": float(source["low"]),
                                "close": float(source["close"]),
                            }
                            async with self._lock:
                                self.candles.append(bar)
                                if len(self.candles) > 1000:
                                    self.candles = self.candles[-1000:]
                                self._save_state()
            except ConnectionClosed:
                await asyncio.sleep(2)
            except Exception:
                await asyncio.sleep(3)

    async def _stream_runner(self, price_url: str, candles_url: str, headers: dict[str, str], symbol: str):
        self._stream_meta = {"running": True, "price_url": price_url, "candles_url": candles_url, "symbol": symbol, "started_at": self._now()}
        try:
            await asyncio.gather(
                self._consume_price(price_url, headers, symbol),
                self._consume_candles(candles_url, headers),
            )
        finally:
            self._stream_meta["running"] = False

    async def start_market_stream(self, mobile: str, domain: str, symbol: Optional[str] = None) -> dict[str, Any]:
        if self._stream_task and not self._stream_task.done():
            return {"success": False, "error": "stream already running", "state": self._stream_meta}

        session = self._load_auth_session(mobile, domain)
        if not session:
            return {"success": False, "error": "auth session not found for mobile/domain"}

        cookies = session.get("cookies") or {}
        headers = dict(session.get("headers") or {})
        if not isinstance(cookies, dict):
            cookies = {}
        if not isinstance(headers, dict):
            headers = {}

        normalized = normalize_domain(domain)
        parsed = urlparse(normalized)
        origin = f"{parsed.scheme}://{parsed.netloc}" if parsed.netloc else normalized
        ws_headers = {
            "User-Agent": headers.get("User-Agent", "Mozilla/5.0"),
            "Accept-Language": headers.get("Accept-Language", "en-US,en;q=0.9"),
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Origin": origin,
            "Cookie": self._cookie_header(cookies),
        }

        price_url, candles_url = self._ws_urls(domain)
        self._stream_stop.clear()
        stream_symbol = (symbol or self.symbol).lower()
        self._stream_task = asyncio.create_task(self._stream_runner(price_url, candles_url, ws_headers, stream_symbol))
        return {"success": True, "state": self._stream_meta}

    async def stop_market_stream(self) -> dict[str, Any]:
        if not self._stream_task:
            return {"success": True, "stopped": False}
        self._stream_stop.set()
        self._stream_task.cancel()
        try:
            await self._stream_task
        except Exception:
            pass
        self._stream_task = None
        return {"success": True, "stopped": True}

    async def stream_state(self) -> dict[str, Any]:
        state = dict(self._stream_meta)
        state["running"] = bool(self._stream_task and not self._stream_task.done())
        return {"success": True, "stream": state}
