from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from threading import Lock, Thread
from typing import Any
from uuid import uuid4

from config import Config
from .strategies.strategy_base import BotConfig, StrategyBase
from .strategies.resolver import resolve_strategy


@dataclass
class BotRuntime:
    strategy: StrategyBase
    thread: Thread | None = None
    lock: Lock | None = None

    def __post_init__(self) -> None:
        if self.lock is None:
            self.lock = Lock()


class TraderWorkerService:
    """Thread-based in-memory trader worker service."""

    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self._lock = asyncio.Lock()
        self._bots: dict[str, dict[str, Any]] = {}
        self._logs: dict[str, list[dict[str, Any]]] = {}

    async def start(self) -> None:
        self.logger.info("Trader worker service started")

    async def stop(self) -> None:
        bot_ids = list(self._bots.keys())
        for bot_id in bot_ids:
            try:
                bot = self._bots.get(bot_id)
                if bot and bot["status"] == "running":
                    await self.stop_bot(bot_id, reason="service_shutdown")
            except Exception as exc:
                self.logger.warning(
                    "Failed to stop bot %s during shutdown: %s", bot_id, exc
                )

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

    def _build_bot_config(self, bot: dict[str, Any]) -> BotConfig:
        return BotConfig(
            bot_id=bot["bot_id"],
            portfolio_id=bot["portfolio_id"],
            run_mode=bot["mode"],
            metadata=bot.get("metadata", {}),
        )

    def _build_strategy(self, bot: dict[str, Any]) -> StrategyBase:
        strategy_cls = resolve_strategy(bot["strategy_name"])
        return strategy_cls(bot["bot_config"])

    def _public_bot(self, bot: dict[str, Any]) -> dict[str, Any]:
        return {key: value for key, value in bot.items() if key not in {"_runtime"}}

    def _run_strategy_thread(self, bot_id: str) -> None:
        bot = self._bots.get(bot_id)
        if not bot:
            return

        runtime: BotRuntime = bot["_runtime"]
        strategy = runtime.strategy

        try:
            self._append_log(bot_id, "INFO", "Worker thread entered")
            strategy.start()
        except Exception as exc:
            self._append_log(bot_id, "ERROR", f"Strategy thread crashed: {exc}")
            bot = self._bots.get(bot_id)
            if bot and bot["status"] != "removed":
                bot["status"] = "error"
                bot["updated_at"] = self._now()
        finally:
            bot = self._bots.get(bot_id)
            if bot is not None:
                runtime.thread = None
                if bot["status"] == "running":
                    bot["status"] = "stopped"
                    bot["updated_at"] = self._now()
            self._append_log(bot_id, "INFO", "Worker thread exited")

    async def create_bot(self, payload: dict[str, Any]) -> dict[str, Any]:
        async with self._lock:
            bot_id = f"bot-{uuid4().hex[:12]}"
            now = self._now()

            bot = {
                "bot_id": bot_id,
                "bot_name": payload["bot_name"],
                "strategy_name": payload["strategy_name"],
                "market": payload["market"],
                "portfolio_id": payload["portfolio_id"],
                "mode": payload["mode"],
                "description": payload.get("description"),
                "metadata": payload.get("metadata", {}),
                "status": "created",
                "created_at": now,
                "updated_at": now,
            }

            bot["bot_config"] = self._build_bot_config(bot)
            strategy = self._build_strategy(bot)
            bot["_runtime"] = BotRuntime(strategy=strategy)

            self._bots[bot_id] = bot
            self._append_log(
                bot_id,
                "INFO",
                f"Bot created with strategy={bot['strategy_name']}",
            )

            return {
                "bot": self._public_bot(bot),
                "message": "Bot created successfully.",
                "placeholder": True,
            }

    async def remove_bot(
        self, bot_id: str, reason: str | None = None
    ) -> dict[str, Any]:
        bot = self._bots.get(bot_id)
        if not bot:
            raise ValueError("bot not found")

        if bot["status"] == "running":
            await self.stop_bot(bot_id, reason="remove_bot")

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
                "message": "Bot removed successfully.",
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
            if bot["status"] == "running":
                raise ValueError("bot is already running")

            runtime: BotRuntime = bot["_runtime"]
            if runtime.thread is not None and runtime.thread.is_alive():
                raise ValueError("bot thread is already active")

            thread = Thread(
                target=self._run_strategy_thread,
                args=(bot_id,),
                name=f"strategy-{bot_id}",
                daemon=True,
            )

            runtime.thread = thread
            bot["status"] = "running"
            bot["updated_at"] = self._now()

            self._append_log(
                bot_id, "INFO", f"Bot started. reason={reason or 'not_provided'}"
            )

            thread.start()

            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Bot started successfully.",
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
            if bot["status"] != "running":
                raise ValueError("bot is not running")

            runtime: BotRuntime = bot["_runtime"]
            strategy: StrategyBase = runtime.strategy
            thread = runtime.thread

            self._append_log(
                bot_id, "INFO", f"Bot stop requested. reason={reason or 'not_provided'}"
            )

            strategy.stop()

        if thread is not None:
            thread.join(timeout=10)

        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")

            if bot["status"] != "removed":
                bot["status"] = "stopped"
                bot["updated_at"] = self._now()

            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "message": "Bot stopped successfully.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }

    async def send_command(
        self,
        bot_id: str,
        command: str,
        payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")
            if bot["status"] == "removed":
                raise ValueError("removed bot can not receive commands")

            runtime: BotRuntime = bot["_runtime"]
            strategy: StrategyBase = runtime.strategy
            strategy.submit_command(command, payload or {})
            bot["updated_at"] = self._now()

            self._append_log(
                bot_id,
                "INFO",
                f"Command submitted command={command} payload={payload or {}}",
            )

            return {
                "bot_id": bot_id,
                "command": command,
                "accepted": True,
                "message": "Command submitted successfully.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }

    async def list_bots(self) -> dict[str, Any]:
        async with self._lock:
            bots = sorted(self._bots.values(), key=lambda item: item["created_at"])
            return {
                "items": [self._public_bot(bot) for bot in bots],
                "count": len(bots),
                "placeholder": True,
            }

    async def get_bot_logs(self, bot_id: str, limit: int) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")

            runtime: BotRuntime = bot["_runtime"]
            logs = runtime.strategy.get_logs()[-limit:]

            return {
                "bot_id": bot_id,
                "source": "strategy",
                "items": logs,
                "count": len(logs),
                "placeholder": True,
            }

    async def get_all_logs(self, limit: int) -> dict[str, Any]:
        async with self._lock:
            items: list[dict[str, Any]] = []

            for bot_id, bot_logs in self._logs.items():
                for entry in bot_logs[-limit:]:
                    items.append(
                        {
                            "bot_id": bot_id,
                            **entry,
                        }
                    )

            items.sort(key=lambda item: item["timestamp"])
            items = items[-limit:]

            return {
                "source": "service",
                "items": items,
                "count": len(items),
                "placeholder": True,
            }

    async def get_status(self, bot_id: str) -> dict[str, Any]:
        async with self._lock:
            bot = self._bots.get(bot_id)
            if not bot:
                raise ValueError("bot not found")

            runtime: BotRuntime = bot["_runtime"]
            thread = runtime.thread

            return {
                "bot_id": bot_id,
                "status": bot["status"],
                "strategy_running": runtime.strategy.is_running,
                "thread_active": thread is not None and thread.is_alive(),
                "message": "Bot status retrieved successfully.",
                "updated_at": bot["updated_at"],
                "placeholder": True,
            }
