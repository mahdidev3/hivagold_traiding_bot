from __future__ import annotations

from collections import deque
from statistics import mean
from typing import Any

from .base import AnalysisModule


class PriceMomentumModule(AnalysisModule):
    module_name = "price_momentum"

    def __init__(self, window: int = 8):
        self._prices = deque(maxlen=max(2, window))

    def analyze(self, market_state: dict[str, Any]) -> dict[str, Any]:
        price = market_state.get("price")
        if price is not None:
            self._prices.append(float(price))
        if len(self._prices) < 3:
            return {"module": self.module_name, "ready": False, "score": 0.0}
        baseline = mean(list(self._prices)[:-1])
        last = self._prices[-1]
        score = (last - baseline) / baseline if baseline else 0.0
        return {"module": self.module_name, "ready": True, "score": score, "last_price": last}


class CandleDirectionModule(AnalysisModule):
    module_name = "candle_direction"

    def __init__(self, window: int = 6):
        self._candles = deque(maxlen=max(2, window))

    def analyze(self, market_state: dict[str, Any]) -> dict[str, Any]:
        candles = market_state.get("candles") or []
        for candle in candles:
            if isinstance(candle, dict) and {"open", "close"}.issubset(candle.keys()):
                self._candles.append({"open": float(candle["open"]), "close": float(candle["close"])})
        if len(self._candles) < 2:
            return {"module": self.module_name, "ready": False, "score": 0.0}
        up = sum(1 for c in self._candles if c["close"] > c["open"])
        down = sum(1 for c in self._candles if c["close"] < c["open"])
        score = (up - down) / max(1, len(self._candles))
        return {"module": self.module_name, "ready": True, "score": score, "candles": len(self._candles)}
