from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from config import Config


class TraderWorkerService:
    """In-memory placeholder service for the trader worker.

    This service intentionally does not implement trading logic yet.
    It only provides a safe API surface so the rest of the project can
    integrate step by step.
    """

    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self._lock = asyncio.Lock()
        self._bots: dict[str, dict[str, Any]] = {}
        self._logs: dict[str, list[dict[str, Any]]] = {}

    async def start(self) -> None:
        self.logger.info("Trader worker service started")

    async def stop(self) -> None:
        self.logger.info("Trader worker service stopped")

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

    def _append_log(self, bot_id: str, level: str, message: str) -> None:
        self._logs.setdefault(bot_id, []).append(
            {
                "timestamp": self._now(),
                "level": level,
                "message": message,
            }
        )

    async def create_bot(self, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            bot_id = f"bot-{uuid4().hex[:12]}"
            now = self._now()
            bot = {
                "bot_id": bot_id,
                "bot_name": payload["bot_name"],
                "strategy_name": payload["strategy_name"],
                "market": payload["market"],
                "mode": payload["mode"],
                "description": payload.get("description"),
                "metadata": payload.get("metadata", {}),
                "status": "created",
                "created_at": now,
                "updated_at": now,
            }
            self._bots[bot_id] = bot
            self._append_log(
                bot_id,
                "INFO",
                "Bot created. Trading functionality is not implemented yet.",
            )
            return {
                "bot": bot,
                "message": "Bot created successfully. This is a placeholder implementation.",
                "placeholder": True,
            }

    async def remove_bot(
        self, bot_id: str, reason: str | None = None
    ) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")
            bot["status"] = "removed"
            bot["updated_at"] = self._now()
            self._append_log(
                bot_id, "WARNING", f"Bot removed. reason={reason or 'not_provided'}"
            )
            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Bot removed. Placeholder only; no external resources were touched.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }

    async def start_bot(self, bot_id: str, reason: str | None = None) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")
            if bot["status"] == "removed":
                raise ValueError("removed bot can not be started")
            bot["status"] = "running"
            bot["updated_at"] = self._now()
            self._append_log(
                bot_id, "INFO", f"Bot started. reason={reason or 'not_provided'}"
            )
            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Bot marked as running. Real worker loop is not implemented yet.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }

    async def stop_bot(self, bot_id: str, reason: str | None = None) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")
            if bot["status"] == "removed":
                raise ValueError("removed bot can not be stopped")
            bot["status"] = "stopped"
            bot["updated_at"] = self._now()
            self._append_log(
                bot_id, "INFO", f"Bot stopped. reason={reason or 'not_provided'}"
            )
            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Bot marked as stopped. Real shutdown logic is not implemented yet.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }

    async def list_bots(self) -> dict[str, Any]:
        async with self._lock:
            bots = sorted(self._bots.values(), key=lambda item: item["created_at"])
            return {
                "items": bots,
                "count": len(bots),
                "placeholder": True,
            }

    async def get_logs(self, bot_id: str, limit: int) -> dict[str, Any]:
        async with self._lock:
            if bot_id not in self._bots:
                raise ValueError("bot not found")
            logs = self._logs.get(bot_id, [])[-limit:]
            return {
                "bot_id": bot_id,
                "items": logs,
                "count": len(logs),
                "placeholder": True,
            }

    async def get_status(self, bot_id: str) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")
            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Placeholder status response. No real trader lifecycle is wired yet.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }
