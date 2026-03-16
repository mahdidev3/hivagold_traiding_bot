from __future__ import annotations

from typing import Any

from .base import AnalysisResult


class PriceAnalysisModule:
    name = "price_analysis"

    def analyze(self, bot: Any) -> AnalysisResult:
        metadata = bot.metadata or {}
        price = metadata.get("price")
        min_price = float(metadata.get("min_price", 0.0))
        max_price = float(metadata.get("max_price", 10_000_000.0))
        if price is None:
            return AnalysisResult(
                module=self.name,
                is_valid=False,
                score=0.0,
                reason="missing price for analysis",
                extra={"price": None},
            )

        current_price = float(price)
        in_range = min_price <= current_price <= max_price
        return AnalysisResult(
            module=self.name,
            is_valid=in_range,
            score=1.0 if in_range else 0.0,
            reason="price is valid" if in_range else "price out of configured range",
            extra={"price": current_price, "min_price": min_price, "max_price": max_price},
        )


class CandleAnalysisModule:
    name = "candle_analysis"

    def analyze(self, bot: Any) -> AnalysisResult:
        candles = (bot.metadata or {}).get("candles") or []
        if len(candles) < 2:
            return AnalysisResult(
                module=self.name,
                is_valid=False,
                score=0.0,
                reason="at least two candles are required",
                extra={"candles_count": len(candles)},
            )

        first_close = float(candles[-2].get("close", 0.0))
        last_close = float(candles[-1].get("close", 0.0))
        trend_up = last_close > first_close
        return AnalysisResult(
            module=self.name,
            is_valid=trend_up,
            score=1.0 if trend_up else 0.0,
            reason="up trend detected" if trend_up else "trend is not favorable",
            extra={"first_close": first_close, "last_close": last_close},
        )


class TestStrategyRunner:
    name = "simple_position_test_v1"

    def __init__(self) -> None:
        self.analysis_modules = [PriceAnalysisModule(), CandleAnalysisModule()]

    async def run(self, service: Any, bot: Any) -> None:
        results = [module.analyze(bot) for module in self.analysis_modules]
        for result in results:
            await service._append_log(
                bot.task_id or "",
                "info",
                f"analysis[{result.module}]",
                {
                    "is_valid": result.is_valid,
                    "score": result.score,
                    "reason": result.reason,
                    **result.extra,
                },
            )

        if bot.run_mode != "simulator":
            await service._append_log(
                bot.task_id or "",
                "warning",
                "run_mode is not simulator; skipped position execution",
                {"run_mode": bot.run_mode},
            )
            return

        if not all(result.is_valid for result in results):
            await service._append_log(
                bot.task_id or "",
                "info",
                "analysis rejected position",
                {
                    "accepted": False,
                    "modules": [result.module for result in results if not result.is_valid],
                },
            )
            return

        try:
            created = await service._create_position_for_test_strategy(bot)
            await service._append_log(
                bot.task_id or "", "info", "position created", {"response": created}
            )
        except Exception as exc:
            await service._append_log(
                bot.task_id or "",
                "error",
                "failed to create position",
                {"error": str(exc)},
            )
