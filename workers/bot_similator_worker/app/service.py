import asyncio
import random
import time
from typing import Any


class SimilatorService:
    def __init__(self, symbol: str, start_price: float):
        self.symbol = symbol
        self.price = float(start_price)
        self.room_open = True
        self.portfolios: list[dict[str, Any]] = []
        self.positions: list[dict[str, Any]] = []
        self.closed_positions: list[dict[str, Any]] = []
        self._next_id = 1
        self._lock = asyncio.Lock()

    def _now(self) -> int:
        return int(time.time())

    def _new_id(self) -> int:
        x = self._next_id
        self._next_id += 1
        return x

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
                return {"success": True, "order": pos}
        return {"success": False, "error": "order not found"}

    async def delete_position(self, pid: int) -> dict[str, Any]:
        async with self._lock:
            for idx, pos in enumerate(self.positions):
                if pos["id"] == pid:
                    deleted = self.positions.pop(idx)
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
        return {"success": True, "closed": closed}

    async def get_orders(self) -> dict[str, Any]:
        return {"success": True, "orders": self.positions}

    async def get_transactions(self) -> dict[str, Any]:
        return {"success": True, "transactions": self.closed_positions}

    async def generate_candles(self) -> list[dict[str, Any]]:
        now = int(time.time())
        base = self.price
        candles = []
        for i in range(120):
            ts = now - (119 - i) * 60
            o = round(base + random.uniform(-2.5, 2.5), 2)
            c = round(o + random.uniform(-1.2, 1.2), 2)
            h = round(max(o, c) + random.uniform(0, 1.2), 2)
            l = round(min(o, c) - random.uniform(0, 1.2), 2)
            candles.append({"ts": ts, "open": o, "high": h, "low": l, "close": c})
        return candles
