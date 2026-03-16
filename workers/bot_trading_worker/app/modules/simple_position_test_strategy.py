from __future__ import annotations

from typing import Any

from config import Config
from .base import MarketSnapshot, StrategyAction, StrategyContext


class SimplePositionTestStrategyModule:
    """Minimal test strategy: create one buy market position if there is no open order."""

    name = "simple_position_test_v1"
    min_bars = 1

    def __init__(self, config: Config):
        self.config = config

    def on_market_update(
        self, snapshot: MarketSnapshot, context: StrategyContext
    ) -> list[StrategyAction]:
        open_orders = context.open_orders or []
        if open_orders:
            return []

        units = 1.0
        payload = {
            "mobile": context.mobile,
            "domain": context.domain,
            "room": context.room,
            "portfolio_id": context.portfolio_id,
            "strategy": self.name,
            "action": "buy",
            "order_type": "market",
            "price": snapshot.latest_price,
            "units": units,
            "stop_loss": round(snapshot.latest_price * 0.99, 2),
            "take_profit": round(snapshot.latest_price * 1.01, 2),
        }
        return [
            StrategyAction(
                operation="create_order",
                payload=payload,
                reason="simple_test_open_single_position",
            )
        ]

    def evaluate(
        self, snapshot: MarketSnapshot, base_payload: dict[str, Any]
    ) -> dict[str, Any]:
        result = dict(base_payload)
        result["strategy"] = self.name
        result["recommendation"] = "buy_market_once_if_no_open_position"
        result["price"] = snapshot.latest_price
        return result
