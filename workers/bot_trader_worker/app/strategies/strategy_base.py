from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from queue import Empty, Queue
from threading import Event, Lock
from typing import Any


@dataclass(slots=True)
class BotConfig:
    bot_id: str
    portfolio_id: str
    run_mode: str
    metadata: dict[str, Any] = field(default_factory=dict)


class StrategyBase(ABC):
    """
    Base class for all trading strategies.

    Thread-based lifecycle:
    - start(): starts the strategy loop in the current worker thread
    - stop(): requests graceful stop
    - run(): blocking strategy loop
    """

    def __init__(self, config: BotConfig):
        self.config = config
        self._logs: list[dict[str, Any]] = []
        self._logs_lock = Lock()
        self._stop_event = Event()
        self._running = False
        self._state_lock = Lock()
        self._command_queue: Queue[dict[str, Any]] = Queue()

    @staticmethod
    def _now() -> datetime:
        return datetime.now(timezone.utc)

    @property
    def is_running(self) -> bool:
        with self._state_lock:
            return self._running

    def get_logs(self) -> list[dict[str, Any]]:
        with self._logs_lock:
            return list(self._logs)

    def log(self, level: str, message: str) -> None:
        with self._logs_lock:
            self._logs.append(
                {
                    "timestamp": self._now(),
                    "level": level,
                    "message": message,
                }
            )

    def submit_command(
        self, command: str, payload: dict[str, Any] | None = None
    ) -> None:
        self._command_queue.put(
            {
                "timestamp": self._now(),
                "command": command,
                "payload": payload or {},
            }
        )

    def process_pending_commands(self) -> list[dict[str, Any]]:
        commands: list[dict[str, Any]] = []

        while True:
            try:
                item = self._command_queue.get_nowait()
                commands.append(item)
            except Empty:
                break

        for item in commands:
            command = item["command"]
            payload = item["payload"]

            if command == "stop":
                self.log("INFO", "Stop command received")
                self._stop_event.set()
            elif command == "get_status":
                self.log("INFO", f"Status command received payload={payload}")
            elif command == "get_logs":
                self.log("INFO", f"Logs command received payload={payload}")
            else:
                self.handle_command(command, payload)

        return commands

    def handle_command(self, command: str, payload: dict[str, Any]) -> None:
        self.log(
            "INFO", f"Unhandled command received command={command} payload={payload}"
        )

    def start(self) -> None:
        with self._state_lock:
            if self._running:
                self.log("WARNING", "Strategy start requested while already running")
                return
            self._running = True

        self._stop_event.clear()
        self.log("INFO", "Strategy started")

        try:
            self.run()
        except Exception as exc:
            self.log("ERROR", f"Strategy crashed: {exc}")
            raise
        finally:
            with self._state_lock:
                self._running = False
            self.log("INFO", "Strategy stopped")

    def stop(self) -> None:
        if not self.is_running:
            self.log("WARNING", "Strategy stop requested while not running")
            return

        self.log("INFO", "Strategy stop requested")
        self._stop_event.set()

    @abstractmethod
    def run(self) -> None:
        """
        Main strategy loop.
        Must periodically check self._stop_event.is_set().
        """
        raise NotImplementedError
