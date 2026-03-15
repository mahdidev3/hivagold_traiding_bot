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


@dataclass
class StrategyContext:
    mobile: str
    domain: str
    room: str
    run_mode: str
    portfolio_id: str | None = None
    open_orders: list[dict[str, Any]] | None = None


@dataclass
class StrategyAction:
    operation: str
    payload: dict[str, Any]
    reason: str


class TradingStrategyModule(Protocol):
    name: str

    def on_market_update(self, snapshot: MarketSnapshot, context: StrategyContext) -> list[StrategyAction]:
        ...

    def evaluate(self, snapshot: MarketSnapshot, base_payload: dict[str, Any]) -> dict[str, Any]:
        ...
