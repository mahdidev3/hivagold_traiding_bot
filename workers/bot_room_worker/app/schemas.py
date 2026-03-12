from typing import Any, Dict, Optional
from pydantic import AliasChoices, BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(description="Health status: 'healthy' or 'unhealthy'")
    app_name: str = Field(description="Application name")
    version: str = Field(description="Application version")


class RoomBaseRequest(BaseModel):
    mobile: str
    base_domain: Optional[str] = None


class ProcessRoomRequest(BaseModel):
    action: str
    mobile: str
    base_domain: Optional[str] = None
    order_type: Optional[str] = Field(
        default=None, validation_alias=AliasChoices("order_type", "ordertype")
    )
    order_id: Optional[str] = None
    transaction_id: Optional[str] = None
    portfolio_id: Optional[str] = None
    units: Optional[float] = None
    price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    amount: Optional[float] = None

    class Config:
        populate_by_name = True
        extra = "allow"


class WorkerBaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


class GetPortfoliosRequest(RoomBaseRequest):
    pass


class GetPortfoliosResponse(WorkerBaseResponse):
    portfolios: Optional[Dict[str, Any]] = None


class CreateActivePortfolioRequest(RoomBaseRequest):
    portfolio_type: str
    initial_balance: float = 1000000


class CreateActivePortfolioResponse(WorkerBaseResponse):
    portfolio: Optional[Dict[str, Any]] = None


class GetOrdersRequest(RoomBaseRequest):
    pass


class GetOrdersResponse(WorkerBaseResponse):
    orders: Optional[Any] = None


class CreateOrderRequest(RoomBaseRequest):
    order_type: str = Field(
        validation_alias=AliasChoices("order_type", "ordertype")
    )
    action: str
    units: float
    price: Optional[float] = None
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None


class CreateOrderResponse(WorkerBaseResponse):
    order: Optional[Dict[str, Any]] = None


class CloseOrderRequest(RoomBaseRequest):
    order_id: str


class CloseOrderResponse(WorkerBaseResponse):
    order: Optional[Dict[str, Any]] = None


class GetTransactionsRequest(RoomBaseRequest):
    pass


class GetTransactionsResponse(WorkerBaseResponse):
    transactions: Optional[Dict[str, Any]] = None


class CloseTransactionRequest(RoomBaseRequest):
    transaction_id: str


class CloseTransactionResponse(WorkerBaseResponse):
    transaction: Optional[Dict[str, Any]] = None


class ClosePortfolioRequest(RoomBaseRequest):
    portfolio_id: str


class ClosePortfolioResponse(WorkerBaseResponse):
    portfolio: Optional[Dict[str, Any]] = None
    closed_orders: Optional[list[str]] = None
    closed_transactions: Optional[list[str]] = None
