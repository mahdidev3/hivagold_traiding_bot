from __future__ import annotations

from typing import Any

from .base import StrategyRuntime, StrategySignal
from .modules import CandleDirectionModule, PriceMomentumModule


class SimplePositionTestStrategy(StrategyRuntime):
    name = "simple_position_test_v1"

    def __init__(self, bot_config: Any):
        super().__init__(bot_config)
        self.price_module = PriceMomentumModule(window=int(self.bot.metadata.get("price_window", 8)))
        self.candle_module = CandleDirectionModule(window=int(self.bot.metadata.get("candle_window", 6)))
        self._already_signaled = False

    async def run_cycle(self, signal_handler):
        market_state = self.bot.metadata.get("market_state") or {}
        price_result = self.price_module.analyze(market_state)
        candle_result = self.candle_module.analyze(market_state)
        combined_score = float(price_result.get("score", 0.0)) + float(candle_result.get("score", 0.0))

        emitted = None
        threshold = float(self.bot.metadata.get("signal_threshold", 0.001))
        if not self._already_signaled and price_result.get("ready") and candle_result.get("ready") and combined_score >= threshold:
            signal = StrategySignal(
                signal_type="open_position",
                confidence=min(1.0, max(0.0, abs(combined_score))),
                payload={
                    "side": self.bot.metadata.get("side", "buy"),
                    "units": float(self.bot.metadata.get("units", 0.1)),
                    "take_profit": float(self.bot.metadata.get("take_profit", 2600.0)),
                    "stop_loss": float(self.bot.metadata.get("stop_loss", 2400.0)),
                    "strategy": self.name,
                    "analysis": {
                        "price": price_result,
                        "candle": candle_result,
                        "score": combined_score,
                    },
                },
            )
            emitted = await signal_handler(signal)
            self._already_signaled = True

        return {
            "strategy": self.name,
            "price_analysis": price_result,
            "candle_analysis": candle_result,
            "combined_score": combined_score,
            "emitted": emitted,
        }
