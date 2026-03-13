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


class ApiActionResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None


class RoomActionRequest(BaseModel):
    mobile: str
    base_domain: Optional[str] = None
    market: Optional[str] = "xag"
    payload: dict[str, Any] = Field(default_factory=dict)


class RoomStatusRequest(BaseModel):
    mobile: str
    base_domain: Optional[str] = None
    market: str = "xag"


class RoomStatusResponse(BaseModel):
    success: bool
    market: str
    is_open: bool
    active: Optional[bool] = None
    reason: Optional[str] = None
    notification: Optional[str] = None


class PortfolioRuleRequest(BaseModel):
    user_id: str
    rule: dict[str, Any]


class PortfolioOrderRequest(BaseModel):
    user_id: str
    side: str
    entry_type: str = "market"
    entry_price: Optional[float] = None
    take_profit: float
    stop_loss: float
    volume: Optional[float] = None
    symbol: str = "xag"


class PortfolioBotOrderRequest(BaseModel):
    user_id: str
    side: str
    take_profit: float
    stop_loss: float
    volume: Optional[float] = None
    symbol: str = "xag"


class PortfolioPriceTickRequest(BaseModel):
    symbol: str = "xag"
    price: float
