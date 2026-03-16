from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class AnalysisResult:
    module: str
    is_valid: bool
    score: float
    reason: str
    extra: dict[str, Any] = field(default_factory=dict)


class StrategyRunner(Protocol):
    name: str

    async def run(self, service: Any, bot: Any) -> None:
        ...
