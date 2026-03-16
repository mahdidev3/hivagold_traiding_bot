from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class StrategySignal:
    signal_type: str
    confidence: float
    payload: dict[str, Any] = field(default_factory=dict)


class SignalHandler(Protocol):
    async def __call__(self, signal: StrategySignal) -> dict[str, Any] | None: ...


class StrategyRuntime(ABC):
    name: str

    def __init__(self, bot_config: Any):
        self.bot = bot_config

    @abstractmethod
    async def run_cycle(self, signal_handler: SignalHandler) -> dict[str, Any]:
        """Run one strategy cycle and optionally emit a signal via handler."""


class AnalysisModule(ABC):
    module_name: str

    @abstractmethod
    def analyze(self, market_state: dict[str, Any]) -> dict[str, Any]:
        """Return module analysis output."""
