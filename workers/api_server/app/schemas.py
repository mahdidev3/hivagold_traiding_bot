from typing import Any, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(description="Health status")
    app_name: str
    version: str


class LoginRequest(BaseModel):
    mobile: str
    password: str
    max_retries: int = 3
    base_domain: Optional[str] = None


class LogoutRequest(BaseModel):
    mobile: str
    base_domain: Optional[str] = None


class BotCreateRequest(BaseModel):
    user_id: str
    portfolio_id: str
    market: str
    strategy: str = "pending"
    simulator_task_id: Optional[str] = None
    mobile: str = ""
    password: str = ""
    domain: str = ""
    run_mode: str = "simulator"
    active: bool = False
    metadata: dict[str, Any] = Field(default_factory=dict)


class BotRefRequest(BaseModel):
    bot_id: Optional[str] = None
    task_id: Optional[str] = None
    mobile: Optional[str] = None
    domain: Optional[str] = None


class ApiActionResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
