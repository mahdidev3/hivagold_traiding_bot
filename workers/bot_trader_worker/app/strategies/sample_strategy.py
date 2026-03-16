from __future__ import annotations

from .strategy_base import StrategyBase

"""
TODO : make ws to hivagold and just log them
TODO : delete logs in pre step
TODO : just create orders in the portfloi_id that we have and (if it is simulator in simulator)
TODO : make a very simple strategy
"""


class SampleStrategy(StrategyBase):
    def handle_command(self, command: str, payload: dict[str, object]) -> None:
        if command == "ping":
            self.log("INFO", f"pong bot={self.config.bot_id} payload={payload}")
            return

        if command == "pause":
            self.log("INFO", f"pause requested bot={self.config.bot_id}")
            return

        if command == "resume":
            self.log("INFO", f"resume requested bot={self.config.bot_id}")
            return

        super().handle_command(command, payload)

    def run(self) -> None:
        self.log("INFO", f"SampleStrategy loop started for bot={self.config.bot_id}")

        while not self._stop_event.is_set():
            self.process_pending_commands()
            self.log("INFO", f"Tick for bot={self.config.bot_id}")
            self._stop_event.wait(timeout=2)

        self.log("INFO", f"SampleStrategy loop exiting for bot={self.config.bot_id}")
