from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(description="Health status")
    app_name: str = Field(description="Application name")
    version: str = Field(description="Application version")


class UserAccount(BaseModel):
    mobile: str
    password: str
    domain: str


class SignalOrder(BaseModel):
    action: str
    ordertype: str
    price: Optional[float] = None
    units: float
    stop_loss: Optional[float]
    take_profit: Optional[float]


class TradingSignal(BaseModel):
    ts: int
    mobile: str
    domain: str
    status: str
    bias: str
    score: float
    confidence: float
    reasons: List[str] = Field(default_factory=list)
    recommendation: Optional[SignalOrder] = None
    metrics: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class ProcessTradingRequest(BaseModel):
    action: str


class ProcessTradingResponse(WorkerBaseResponse):
    result: Optional[Dict[str, Any]] = None


class LatestSignalsResponse(WorkerBaseResponse):
    signals: List[TradingSignal] = Field(default_factory=list)
