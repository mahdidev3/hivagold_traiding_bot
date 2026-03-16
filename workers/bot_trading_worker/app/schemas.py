from typing import Any, Dict, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class TradingBotContext(BaseModel):
    user_id: str
    portfolio_id: str
    market: str
    strategy: str = "pending"
    simulator_task_id: Optional[str] = None
    mobile: str = ""
    password: str = ""
    domain: str = ""
    run_mode: Literal["simulator", "real"] = "simulator"
    active: bool = True
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ProcessTradingRequest(BaseModel):
    action: Literal[
        "start",
        "stop",
        "status",
        "list_bots",
        "activate_bot",
        "deactivate_bot",
        "create_bot",
        "remove_bot",
        "start_bot",
        "stop_bot",
        "get_task_status",
        "get_task_logs",
    ]
    task_id: Optional[str] = None
    user_id: Optional[str] = None
    portfolio_id: Optional[str] = None
    market: Optional[str] = None
    simulator_task_id: Optional[str] = None
    mobile: Optional[str] = None
    password: Optional[str] = None
    domain: Optional[str] = None
    bot_id: Optional[str] = None
    strategy: Optional[str] = "pending"
    run_mode: Optional[str] = "simulator"
    active: Optional[bool] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class ProcessTradingResponse(WorkerBaseResponse):
    result: Optional[Dict[str, Any]] = None


class BotEvent(BaseModel):
    ts: int
    task_id: str
    user_id: str
    portfolio_id: str
    market: str
    mobile: str
    domain: str
    strategy: str
    run_mode: str
    event: str
    payload: Dict[str, Any] = Field(default_factory=dict)

