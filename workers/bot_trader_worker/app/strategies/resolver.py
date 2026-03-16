from __future__ import annotations

from .strategy_base import StrategyBase
from .sample_strategy import SampleStrategy
from .ws_metadata_strategy import WsMetadataStrategy


STRATEGY_REGISTRY: dict[str, type[StrategyBase]] = {
    "sample_strategy": SampleStrategy,
    "ws_metadata_strategy": WsMetadataStrategy,
}


def resolve_strategy(strategy_name: str) -> type[StrategyBase]:
    normalized = strategy_name.strip().lower()
    strategy_cls = STRATEGY_REGISTRY.get(normalized)

    if strategy_cls is None:
        available = ", ".join(sorted(STRATEGY_REGISTRY.keys())) or "none"
        raise ValueError(
            f"unknown strategy '{strategy_name}'. available strategies: {available}"
        )

    return strategy_cls
