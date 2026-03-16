from __future__ import annotations


from .strategy_base import StrategyBase
from .sample_strategy import SampleStrategy

try:
    from .ws_metadata_strategy import WsMetadataStrategy
except ImportError as err:
    print(err)
    WsMetadataStrategy = None

STRATEGY_REGISTRY: dict[str, type[StrategyBase]] = {
    "sample_strategy": SampleStrategy,
}

if WsMetadataStrategy is not None:
    STRATEGY_REGISTRY["ws_metadata_strategy"] = WsMetadataStrategy


def resolve_strategy(strategy_name: str) -> type[StrategyBase]:
    normalized = strategy_name.strip().lower()
    strategy_cls = STRATEGY_REGISTRY.get(normalized)

    if strategy_cls is None:
        available = ", ".join(sorted(STRATEGY_REGISTRY.keys())) or "none"
        raise ValueError(
            f"unknown strategy '{strategy_name}'. available strategies: {available}"
        )

    return strategy_cls
