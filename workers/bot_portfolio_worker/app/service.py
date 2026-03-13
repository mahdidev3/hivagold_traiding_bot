import asyncio
import json
import logging
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import websockets

from config import Config


@dataclass
class OpenOrder:
    id: int
    user_id: str
    symbol: str
    side: str
    status: str
    entry_type: str
    entry_price: Optional[float]
    take_profit: float
    stop_loss: float
    volume: float
    opened_price: Optional[float]
    closed_price: Optional[float] = None
    pnl: Optional[float] = None
    closed_reason: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class PortfolioWorkerService:
    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self.db_path = Path(config.DATABASE_PATH)
        self._lock = asyncio.Lock()
        self._ws_task: Optional[asyncio.Task] = None
        self._running = False

    async def start(self):
        self._init_db()
        self._running = True
        if self.config.PRICE_WS_URL:
            self._ws_task = asyncio.create_task(self._price_ws_loop())

    async def stop(self):
        self._running = False
        if self._ws_task:
            self._ws_task.cancel()
            try:
                await self._ws_task
            except Exception:
                pass

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with self._conn() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS portfolio_rules (
                    user_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    strategy TEXT NOT NULL,
                    fixed_volume REAL,
                    risk_percent REAL,
                    max_open_orders INTEGER NOT NULL DEFAULT 1,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    symbol TEXT NOT NULL,
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

    def upsert_rule(self, user_id: str, rule: dict[str, Any]) -> dict[str, Any]:
        now = datetime.now(timezone.utc).isoformat()
        with self._conn() as conn:
            conn.execute(
                """
                INSERT INTO portfolio_rules(user_id, name, strategy, fixed_volume, risk_percent, max_open_orders, updated_at)
                VALUES(?,?,?,?,?,?,?)
                ON CONFLICT(user_id) DO UPDATE SET
                    name=excluded.name,
                    strategy=excluded.strategy,
                    fixed_volume=excluded.fixed_volume,
                    risk_percent=excluded.risk_percent,
                    max_open_orders=excluded.max_open_orders,
                    updated_at=excluded.updated_at
                """,
                (
                    user_id,
                    rule["name"],
                    rule["strategy"],
                    rule.get("fixed_volume"),
                    rule.get("risk_percent"),
                    rule["max_open_orders"],
                    now,
                ),
            )
        return {"success": True, "user_id": user_id, "rule": rule}

    def _resolve_volume(self, user_id: str, requested_volume: Optional[float]) -> float:
        if requested_volume and requested_volume > 0:
            return requested_volume
        with self._conn() as conn:
            row = conn.execute(
                "SELECT strategy, fixed_volume, risk_percent FROM portfolio_rules WHERE user_id=?",
                (user_id,),
            ).fetchone()
        if not row:
            return 1.0
        if row["strategy"] == "fixed":
            return float(row["fixed_volume"] or 1.0)
        # risk-based fallback: account balance is not available in this worker, use safe proxy.
        risk_percent = float(row["risk_percent"] or 1.0)
        return round(max(0.01, risk_percent / 10.0), 2)

    def create_order(self, payload: dict[str, Any]) -> dict[str, Any]:
        if abs(payload["take_profit"] - payload["stop_loss"]) < self.config.MIN_TP_PIPS:
            return {"success": False, "error": "TP and SL distance is too small"}

        volume = self._resolve_volume(payload["user_id"], payload.get("volume"))
        now = datetime.now(timezone.utc).isoformat()
        status = "open" if payload["entry_type"] == "market" else "pending"
        opened_price = payload.get("entry_price") if status == "open" else None

        with self._conn() as conn:
            open_count = conn.execute(
                "SELECT COUNT(*) AS cnt FROM orders WHERE user_id=? AND status IN ('open','pending')",
                (payload["user_id"],),
            ).fetchone()["cnt"]
            max_open = conn.execute(
                "SELECT max_open_orders FROM portfolio_rules WHERE user_id=?",
                (payload["user_id"],),
            ).fetchone()
            max_allowed = int(max_open["max_open_orders"]) if max_open else 1
            if open_count >= max_allowed:
                return {"success": False, "error": "Max open orders reached for user"}

            cursor = conn.execute(
                """
                INSERT INTO orders(user_id, symbol, side, status, entry_type, entry_price, opened_price, take_profit, stop_loss, volume, created_at, updated_at)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    payload["user_id"],
                    payload["symbol"],
                    payload["side"],
                    status,
                    payload["entry_type"],
                    payload.get("entry_price"),
                    opened_price,
                    payload["take_profit"],
                    payload["stop_loss"],
                    volume,
                    now,
                    now,
                ),
            )
            order_id = cursor.lastrowid
        return {"success": True, "order_id": order_id, "status": status, "volume": volume}

    async def on_price_tick(self, symbol: str, price: float) -> dict[str, Any]:
        async with self._lock:
            closed = 0
            entered = 0
            with self._conn() as conn:
                rows = conn.execute(
                    "SELECT * FROM orders WHERE symbol=? AND status IN ('pending','open')",
                    (symbol,),
                ).fetchall()
                for row in rows:
                    order = OpenOrder(**dict(row))
                    if order.status == "pending" and self._should_enter(order, price):
                        conn.execute(
                            "UPDATE orders SET status='open', opened_price=?, updated_at=? WHERE id=?",
                            (price, self._now(), order.id),
                        )
                        entered += 1
                        continue
                    if order.status == "open" and order.opened_price is not None:
                        reason = self._close_reason(order, price)
                        if reason:
                            pnl = self._calc_pnl(order, price)
                            conn.execute(
                                "UPDATE orders SET status='closed', closed_price=?, pnl=?, closed_reason=?, updated_at=? WHERE id=?",
                                (price, pnl, reason, self._now(), order.id),
                            )
                            closed += 1
            return {"success": True, "entered": entered, "closed": closed}

    def user_stats(self, user_id: str) -> dict[str, Any]:
        with self._conn() as conn:
            row = conn.execute(
                """
                SELECT
                    COUNT(*) AS closed_orders,
                    SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) AS wins,
                    SUM(CASE WHEN pnl <= 0 THEN 1 ELSE 0 END) AS losses,
                    COALESCE(SUM(pnl),0) AS total_pnl
                FROM orders
                WHERE user_id=? AND status='closed'
                """,
                (user_id,),
            ).fetchone()
        closed = int(row["closed_orders"] or 0)
        wins = int(row["wins"] or 0)
        losses = int(row["losses"] or 0)
        win_rate = round((wins / closed) * 100, 2) if closed else 0.0
        return {
            "user_id": user_id,
            "closed_orders": closed,
            "wins": wins,
            "losses": losses,
            "win_rate": win_rate,
            "total_pnl": float(row["total_pnl"] or 0),
        }

    def _should_enter(self, order: OpenOrder, price: float) -> bool:
        if order.entry_price is None:
            return True
        if order.side == "buy":
            return price <= order.entry_price
        return price >= order.entry_price

    def _close_reason(self, order: OpenOrder, price: float) -> Optional[str]:
        if order.side == "buy":
            if price >= order.take_profit:
                return "tp"
            if price <= order.stop_loss:
                return "sl"
        else:
            if price <= order.take_profit:
                return "tp"
            if price >= order.stop_loss:
                return "sl"
        return None

    def _calc_pnl(self, order: OpenOrder, close_price: float) -> float:
        direction = 1 if order.side == "buy" else -1
        return round((close_price - float(order.opened_price)) * direction * order.volume, 4)

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    async def _price_ws_loop(self):
        while self._running:
            try:
                async with websockets.connect(self.config.PRICE_WS_URL) as ws:
                    await ws.send(self.config.PRICE_WS_SUBSCRIBE_MESSAGE)
                    while self._running:
                        raw = await ws.recv()
                        payload = json.loads(raw)
                        price = payload.get("price")
                        symbol = payload.get("symbol", self.config.PRICE_WS_SYMBOL)
                        if isinstance(price, (int, float)):
                            await self.on_price_tick(symbol=symbol, price=float(price))
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.warning("price websocket reconnect: %s", exc)
                await asyncio.sleep(3)
