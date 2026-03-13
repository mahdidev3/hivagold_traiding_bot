from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class PortfolioRule(BaseModel):
    name: str = Field(min_length=3, max_length=80)
    strategy: Literal["fixed", "balance_percent"] = "fixed"
    fixed_volume: Optional[float] = None
    risk_percent: Optional[float] = None
    max_open_orders: int = 1


class UpsertRuleRequest(BaseModel):
    user_id: str = Field(min_length=3, max_length=80)
    rule: PortfolioRule


class CreateOrderRequest(BaseModel):
    user_id: str = Field(min_length=3, max_length=80)
    side: Literal["buy", "sell"]
    entry_type: Literal["market", "limit"] = "market"
    entry_price: Optional[float] = None
    take_profit: float
    stop_loss: float
    volume: Optional[float] = None
    symbol: str = "xag"

    @field_validator("entry_price")
    @classmethod
    def validate_entry_price(cls, value: Optional[float], info):
        if info.data.get("entry_type") == "limit" and value is None:
            raise ValueError("entry_price is required when entry_type=limit")
        return value


class PriceTickRequest(BaseModel):
    symbol: str = "xag"
    price: float


class BotOrderRequest(BaseModel):
    user_id: str
    side: Literal["buy", "sell"]
    take_profit: float
    stop_loss: float
    volume: Optional[float] = None
    symbol: str = "xag"


class UserStatsResponse(BaseModel):
    user_id: str
    closed_orders: int
    wins: int
    losses: int
    win_rate: float
    total_pnl: float
