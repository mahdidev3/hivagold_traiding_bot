import asyncio
import json
import logging
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import redis

from config import Config


@dataclass
class Position:
    id: int
    strategy: str
    side: str
    status: str
    entry_type: str
    entry_price: Optional[float]
    opened_price: Optional[float]
    closed_price: Optional[float]
    take_profit: float
    stop_loss: float
    volume: float
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
        self._running = False
        self._consumer_task: Optional[asyncio.Task] = None
        self.redis_client = redis.Redis(
            host=config.REDIS_HOST,
            port=config.REDIS_PORT,
            db=config.REDIS_DB,
            password=config.REDIS_PASSWORD or None,
            decode_responses=True,
        )

    async def start(self):
        self._init_db()
        self._running = True
        self._consumer_task = asyncio.create_task(self._event_consumer_loop())

    async def stop(self):
        self._running = False
        if self._consumer_task:
            self._consumer_task.cancel()
            try:
                await self._consumer_task
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
                CREATE TABLE IF NOT EXISTS strategy_portfolios (
                    strategy TEXT PRIMARY KEY,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS strategy_positions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    strategy TEXT NOT NULL,
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


    async def process(self, args: dict[str, Any]) -> dict[str, Any]:
        action = args.get("action")
        payload = args.get("payload") or {}
        if action == "event":
            return {"success": True, "result": await self.on_market_event(payload)}
        if action == "price_tick":
            price = float(payload.get("price"))
            return {"success": True, "result": await self.process_price_tick(price)}
        if action == "strategy_stats":
            strategy = str(payload.get("strategy", "")).strip()
            return {"success": True, "result": self.strategy_stats(strategy)}
        if action == "list_strategies":
            return {"success": True, "result": {"strategies": self.list_strategies()}}
        if action == "status":
            return {"success": True, "result": {"running": self._running, "strategies": self.list_strategies()}}
        return {"success": False, "error": f"Unknown action: {action}"}
    async def on_market_event(self, event: dict[str, Any]) -> dict[str, Any]:
        event_type = event.get("event")
        payload = event.get("payload") or {}
        if event_type == "signal":
            return await self._handle_signal(payload)
        if event_type == "price":
            return await self._handle_price(payload)
        return {"success": True, "ignored": event_type}

    async def _handle_signal(self, signal: dict[str, Any]) -> dict[str, Any]:
        if signal.get("status") != "signal":
            return {"success": True, "ignored": "no-trade-signal"}
        recommendation = signal.get("recommendation") or {}
        strategy = signal.get("strategy") or "unknown"
        side = recommendation.get("action")
        if side not in {"buy", "sell"}:
            return {"success": True, "ignored": "invalid-side"}

        entry_type = recommendation.get("ordertype", "market")
        price = recommendation.get("price")
        take_profit = recommendation.get("take_profit")
        stop_loss = recommendation.get("stop_loss")
        volume = float(recommendation.get("units") or 1.0)
        if take_profit is None or stop_loss is None:
            return {"success": True, "ignored": "missing-risk-levels"}

        now = self._now()
        async with self._lock:
            with self._conn() as conn:
                conn.execute(
                    """
                    INSERT INTO strategy_portfolios(strategy, created_at, updated_at)
                    VALUES(?,?,?)
                    ON CONFLICT(strategy) DO UPDATE SET updated_at=excluded.updated_at
                    """,
                    (strategy, now, now),
                )
                opened_price = float(price) if (entry_type == "market" and price is not None) else None
                conn.execute(
                    """
                    INSERT INTO strategy_positions(strategy, side, status, entry_type, entry_price, opened_price, take_profit, stop_loss, volume, created_at, updated_at)
                    VALUES(?,?,?,?,?,?,?,?,?,?,?)
                    """,
                    (
                        strategy,
                        side,
                        "open" if entry_type == "market" else "pending",
                        entry_type,
                        float(price) if price is not None else None,
                        opened_price,
                        float(take_profit),
                        float(stop_loss),
                        volume,
                        now,
                        now,
                    ),
                )
        return {"success": True, "created": True, "strategy": strategy}

    async def _handle_price(self, payload: dict[str, Any]) -> dict[str, Any]:
        price = payload.get("price")
        if not isinstance(price, (int, float)):
            return {"success": True, "ignored": "bad-price"}
        return await self.process_price_tick(float(price))

    async def process_price_tick(self, price: float) -> dict[str, Any]:
        async with self._lock:
            entered = 0
            closed = 0
            with self._conn() as conn:
                rows = conn.execute("SELECT * FROM strategy_positions WHERE status IN ('pending','open')").fetchall()
                for row in rows:
                    order = Position(**dict(row))
                    if order.status == "pending" and self._should_enter(order, price):
                        conn.execute("UPDATE strategy_positions SET status='open', opened_price=?, updated_at=? WHERE id=?", (price, self._now(), order.id))
                        entered += 1
                        continue
                    if order.status == "open" and order.opened_price is not None:
                        reason = self._close_reason(order, price)
                        if reason:
                            pnl = self._calc_pnl(order, price)
                            conn.execute("UPDATE strategy_positions SET status='closed', closed_price=?, pnl=?, closed_reason=?, updated_at=? WHERE id=?", (price, pnl, reason, self._now(), order.id))
                            closed += 1
            return {"success": True, "entered": entered, "closed": closed}

    def strategy_stats(self, strategy: str) -> dict[str, Any]:
        with self._conn() as conn:
            row = conn.execute(
                """
                SELECT COUNT(*) AS closed_positions,
                       SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) AS wins,
                       SUM(CASE WHEN pnl <= 0 THEN 1 ELSE 0 END) AS losses,
                       COALESCE(SUM(pnl),0) AS total_pnl
                FROM strategy_positions
                WHERE strategy=? AND status='closed'
                """,
                (strategy,),
            ).fetchone()
        closed = int(row["closed_positions"] or 0)
        wins = int(row["wins"] or 0)
        return {
            "strategy": strategy,
            "closed_positions": closed,
            "wins": wins,
            "losses": int(row["losses"] or 0),
            "win_rate": round((wins / closed) * 100, 2) if closed else 0.0,
            "total_pnl": float(row["total_pnl"] or 0.0),
        }

    def list_strategies(self) -> list[str]:
        with self._conn() as conn:
            rows = conn.execute("SELECT strategy FROM strategy_portfolios ORDER BY strategy").fetchall()
        return [row["strategy"] for row in rows]

    def list_positions(self, strategy: str | None = None) -> list[dict[str, Any]]:
        query = "SELECT * FROM strategy_positions"
        params: tuple[Any, ...] = ()
        if strategy:
            query += " WHERE strategy=?"
            params = (strategy,)
        query += " ORDER BY id DESC"
        with self._conn() as conn:
            rows = conn.execute(query, params).fetchall()
        return [dict(row) for row in rows]

    def db_records(self) -> dict[str, Any]:
        with self._conn() as conn:
            portfolios = [
                dict(row)
                for row in conn.execute(
                    "SELECT * FROM strategy_portfolios ORDER BY strategy"
                ).fetchall()
            ]
        positions = self.list_positions()
        return {
            "portfolios": portfolios,
            "positions": positions,
            "counts": {
                "portfolios": len(portfolios),
                "positions": len(positions),
            },
        }

    def strategy_pnl_positions(self, strategy: str) -> dict[str, Any]:
        return {
            "strategy": strategy,
            "stats": self.strategy_stats(strategy),
            "positions": self.list_positions(strategy),
        }

    def admin_all_data(self) -> dict[str, Any]:
        strategies = self.list_strategies()
        by_strategy = {
            strategy: self.strategy_pnl_positions(strategy)
            for strategy in strategies
        }
        return {
            "db": self.db_records(),
            "strategies": by_strategy,
        }

    def _should_enter(self, order: Position, price: float) -> bool:
        if order.entry_price is None:
            return True
        return price <= order.entry_price if order.side == "buy" else price >= order.entry_price

    def _close_reason(self, order: Position, price: float) -> Optional[str]:
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

    def _calc_pnl(self, order: Position, close_price: float) -> float:
        direction = 1 if order.side == "buy" else -1
        return round((close_price - float(order.opened_price)) * direction * order.volume, 4)

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    async def _event_consumer_loop(self):
        pubsub = self.redis_client.pubsub(ignore_subscribe_messages=True)
        pubsub.subscribe(self.config.REDIS_MARKET_EVENT_CHANNEL)
        try:
            while self._running:
                message = await asyncio.to_thread(pubsub.get_message, 1.0)
                if not message:
                    await asyncio.sleep(0.1)
                    continue
                try:
                    event = json.loads(message["data"])
                except Exception:
                    continue
                await self.on_market_event(event)
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            self.logger.warning("portfolio event consumer reconnect: %s", exc)
        finally:
            await asyncio.to_thread(pubsub.close)
