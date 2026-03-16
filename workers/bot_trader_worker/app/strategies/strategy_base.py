from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from typing import Any
from dataclasses import dataclass, field
from datetime import datetime, timezone


@dataclass(slots=True)
class BotConfig:
    bot_id: str
    portfolio_id: str
    run_mode: str
    metadata: dict[str, Any] = field(default_factory=dict)


class StrategyBase(ABC):
    """
    Base class for all trading strategies.

    Every strategy must implement:
    - start(): start strategy loop
    - stop(): stop strategy loop
    """

    def __init__(self, config: BotConfig):
        self.config = config
        self._logs: list[dict[str, Any]] = []
        self._stop_event = asyncio.Event()
        self._running = False

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

    @property
    def is_running(self) -> bool:
        return self._running

    def get_logs(self) -> list[dict[str, Any]]:
        return self._logs

    def log(self, level: str, message: str) -> None:
        self._logs.append(
            {
                "timestamp": self._now(),
                "level": level,
                "message": message,
            }
        )

    async def start(self) -> None:
        if self._running:
            self.log("WARNING", "Strategy start requested while already running")
            return

        self._stop_event.clear()
        self._running = True
        self.log("INFO", "Strategy started")

        try:
            await self.run()
        except asyncio.CancelledError:
            self.log("WARNING", "Strategy task cancelled")
            raise
        except Exception as exc:
            self.log("ERROR", f"Strategy crashed: {exc}")
            raise
        finally:
            self._running = False
            self.log("INFO", "Strategy stopped")

    async def stop(self) -> None:
        if not self._running:
            self.log("WARNING", "Strategy stop requested while not running")
            return

        self.log("INFO", "Strategy stop requested")
        self._stop_event.set()

    @abstractmethod
    async def run(self) -> None:
        """
        Main strategy loop.
        Must periodically check self._stop_event.is_set().
        """
        raise NotImplementedError
