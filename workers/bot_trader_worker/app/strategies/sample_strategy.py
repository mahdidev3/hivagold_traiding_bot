from __future__ import annotations

import asyncio

from .strategy_base import StrategyBase

""" 
TODO : thread check and make them thread
TODO : make ws to hivagold and just log them
TODO : delete logs in pre step
TODO : just create orders in the portfloi_id that we have and (if it is simulator in simulator)
TODO : make a very simple strategy
"""


class SampleStrategy(StrategyBase):
    async def run(self) -> None:
        self.log("INFO", f"SampleStrategy loop started for bot={self.config.bot_id}")

        while not self._stop_event.is_set():
            self.log("INFO", f"Tick for bot={self.config.bot_id}")
            await asyncio.sleep(2)

        self.log("INFO", f"SampleStrategy loop exiting for bot={self.config.bot_id}")
