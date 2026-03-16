from __future__ import annotations

from typing import Any

from .test_strategy import TestStrategyRunner


class NoopStrategyRunner:
    name = "noop"

    async def run(self, service: Any, bot: Any) -> None:
        await service._append_log(
            bot.task_id or "",
            "warning",
            "strategy is not implemented",
            {"strategy": bot.strategy},
        )


def get_strategy_runner(strategy_name: str) -> Any:
    if strategy_name == "simple_position_test_v1":
        return TestStrategyRunner()
    return NoopStrategyRunner()
