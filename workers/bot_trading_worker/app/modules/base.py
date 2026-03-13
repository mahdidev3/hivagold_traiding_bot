from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol


@dataclass
class MarketSnapshot:
    now_ts: int
    bars: list[dict[str, float]]
    latest_price: float
    latest_wall: dict[str, Any] | None
    last_error: str | None = None


class TradingStrategyModule(Protocol):
    name: str

    def evaluate(self, snapshot: MarketSnapshot, base_payload: dict[str, Any]) -> dict[str, Any]:
        ...
