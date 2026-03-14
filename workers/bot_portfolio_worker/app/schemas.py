from typing import Any, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class ProcessPortfolioRequest(BaseModel):
    action: str = Field(description="event|price_tick|strategy_stats|list_strategies")
    payload: dict[str, Any] = Field(default_factory=dict)


class ProcessPortfolioResponse(WorkerBaseResponse):
    result: Optional[dict[str, Any]] = None


class StrategyPnlPositionResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)


class DbRecordsResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)


class AdminDbResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)
