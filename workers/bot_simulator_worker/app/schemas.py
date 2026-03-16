from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class SimulationTaskCreateRequest(BaseModel):
    portfolio_id: str
    user_id: str
    market: Literal["mazaneh", "ounce", "mazaneh_xag", "xag"]
    domain: Optional[str] = None
    initial_units: float = Field(gt=0)


class SimulationTaskCloseRequest(BaseModel):
    reason: str = "manual"


class PositionCreateRequest(BaseModel):
    strategy: str = "manual"
    side: Literal["buy", "sell"]
    entry_type: Literal["market", "limit"] = "market"
    entry_price: Optional[float] = None
    take_profit: float
    stop_loss: float
    units: float = Field(default=1.0, gt=0)


class PositionUpdateRequest(BaseModel):
    take_profit: Optional[float] = None
    stop_loss: Optional[float] = None
    entry_price: Optional[float] = None
    units: Optional[float] = Field(default=None, gt=0)


class PositionStopLossUpdateRequest(BaseModel):
    stop_loss: float


class PositionCloseRequest(BaseModel):
    close_price: Optional[float] = None
    reason: str = "manual"


class PriceTickRequest(BaseModel):
    task_id: str
    market: Literal["mazaneh", "ounce", "mazaneh_xag", "xag"]
    price: float


class GenericResultResponse(WorkerBaseResponse):
    result: dict[str, Any] = Field(default_factory=dict)
