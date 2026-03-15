from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class TradingBotContext(BaseModel):
    mobile: str
    password: str
    domain: str
    strategy: str = "pending"
    room: str = "xag"
    run_mode: Literal["simulator", "real"] = "simulator"
    active: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProcessTradingRequest(BaseModel):
    action: Literal["start", "stop", "status", "list_bots", "activate_bot", "deactivate_bot"]
    mobile: Optional[str] = None
    domain: Optional[str] = None


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class ProcessTradingResponse(WorkerBaseResponse):
    result: Optional[Dict[str, Any]] = None


class BotEvent(BaseModel):
    ts: int
    mobile: str
    domain: str
    strategy: str
    run_mode: str
    event: str
    payload: Dict[str, Any] = Field(default_factory=dict)

