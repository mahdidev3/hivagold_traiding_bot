from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class PositionCreateRequest(BaseModel):
    mobile: str
    domain: Optional[str] = None
    strategy: str = "manual"
    symbol: str = "xag"
    side: Literal["buy", "sell"]
    entry_type: Literal["market", "limit"] = "market"
    entry_price: Optional[float] = None
    take_profit: float
    stop_loss: float
    volume: float = 1.0


class PositionUpdateRequest(BaseModel):
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    entry_price: Optional[float] = None
    volume: Optional[float] = None


class PositionCloseRequest(BaseModel):
    close_price: Optional[float] = None
    reason: str = "manual"


class PriceTickRequest(BaseModel):
    price: float
    symbol: Optional[str] = None


class StrategyTaskRequest(BaseModel):
    mobile: str
    domain: Optional[str] = None
    room: str = "xag"
    strategy: str = "helper-candle-break-v1"
    simulation: bool = True


class GenericResultResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)
