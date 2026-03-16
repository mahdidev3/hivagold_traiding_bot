from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


BotStatus = Literal["created", "running", "stopped", "removed", "error"]


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class WorkerBaseResponse(BaseModel):
    success: bool
    error: str | None = None


class TraderBotCreateRequest(BaseModel):
    bot_name: str = Field(min_length=1, max_length=128)
    strategy_name: str = Field(min_length=1, max_length=128)
    market: str = Field(min_length=1, max_length=64)
    portfolio_id: str = Field(min_length=1, max_length=128)
    mode: Literal["market", "simulator"] = "simulator"
    description: str | None = Field(default=None, max_length=500)
    metadata: dict[str, Any] = Field(default_factory=dict)


class TraderBotActionRequest(BaseModel):
    reason: str | None = Field(default=None, max_length=250)


class TraderBotSummary(BaseModel):
    bot_id: str
    bot_name: str
    strategy_name: str
    market: str
    mode: str
    status: BotStatus
    created_at: datetime
    updated_at: datetime


class TraderBotStatusResponse(BaseModel):
    bot_id: str
    status: BotStatus
    message: str
    updated_at: datetime
    placeholder: bool = True


class TraderBotLogItem(BaseModel):
    timestamp: datetime
    level: Literal["INFO", "WARNING", "ERROR"]
    message: str


class GenericResultResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)
