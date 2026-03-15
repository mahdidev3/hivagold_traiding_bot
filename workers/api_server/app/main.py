from contextlib import asynccontextmanager
import asyncio
from logging import Logger

from fastapi import FastAPI, Header, HTTPException

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .schemas import (
    ApiActionResponse,
    HealthResponse,
    LoginRequest,
    LogoutRequest,
    PortfolioBotOrderRequest,
    PortfolioOrderRequest,
    PortfolioPriceTickRequest,
    PortfolioRuleRequest,
    RoomActionRequest,
    RoomStatusRequest,
    RoomStatusResponse,
)
from .service import ApiServerService

config = get_config()
logger: Logger = setup_logger(config)

auth_client, room_client, trading_client, portfolio_client = build_clients(
    config, logger
)
service = ApiServerService(
    config, auth_client, room_client, trading_client, portfolio_client, logger
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def require_admin_key(x_admin_key: str = Header(default="")):
    if x_admin_key != config.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin API key")


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION
    )


@app.post("/login", response_model=ApiActionResponse)
async def login(payload: LoginRequest):
    try:
        logger.debug("Received login request")
        result = await asyncio.to_thread(
            service.execute, "login", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/logout", response_model=ApiActionResponse)
async def logout(payload: LogoutRequest):
    try:
        logger.debug("Received logout request")
        result = await asyncio.to_thread(
            service.execute, "logout", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/signals/latest", response_model=ApiActionResponse)
async def signals_latest():
    try:
        logger.debug("Received signals_latest request")
        result = await asyncio.to_thread(service.execute, "get_signals", {})
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/status", response_model=RoomStatusResponse)
async def room_status(payload: RoomStatusRequest):
    try:
        logger.debug("Received room_status request")
        result = await asyncio.to_thread(
            service.execute, "check_room_status", payload.model_dump()
        )
        return RoomStatusResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/portfolio/rules", response_model=ApiActionResponse)
async def portfolio_rule(payload: PortfolioRuleRequest):
    result = await asyncio.to_thread(
        service.execute, "portfolio_rule_upsert", payload.model_dump()
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/portfolio/orders", response_model=ApiActionResponse)
async def portfolio_order(payload: PortfolioOrderRequest):
    result = await asyncio.to_thread(
        service.execute, "portfolio_order_create", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/portfolio/orders/bot", response_model=ApiActionResponse)
async def portfolio_order_bot(payload: PortfolioBotOrderRequest):
    result = await asyncio.to_thread(
        service.execute, "portfolio_order_bot", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/portfolio/price", response_model=ApiActionResponse)
async def portfolio_price(payload: PortfolioPriceTickRequest):
    result = await asyncio.to_thread(
        service.execute, "portfolio_price_tick", payload.model_dump()
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/portfolio/users/{user_id}/stats", response_model=ApiActionResponse)
async def portfolio_user_stats(user_id: str):
    result = await asyncio.to_thread(
        service.execute, "portfolio_user_stats", {"user_id": user_id}
    )
    return ApiActionResponse(success=result.get("user_id") is not None, data=result)


@app.get("/portfolio/db/records", response_model=ApiActionResponse)
async def portfolio_db_records():
    result = await asyncio.to_thread(service.execute, "portfolio_db_records", {})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get(
    "/portfolio/strategies/{strategy}/pnl-positions", response_model=ApiActionResponse
)
async def portfolio_strategy_pnl_positions(strategy: str):
    result = await asyncio.to_thread(
        service.execute, "portfolio_strategy_pnl_positions", {"strategy": strategy}
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/admin/db/all", response_model=ApiActionResponse)
async def admin_db_all(x_admin_key: str = Header(default="", alias="x-admin-key")):
    require_admin_key(x_admin_key)
    result = await asyncio.to_thread(service.execute, "portfolio_admin_db", {})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/room/{action_name}", response_model=ApiActionResponse)
async def room_action(action_name: str, payload: RoomActionRequest):
    endpoints = {
        "portfolios": "/room/portfolios",
        "portfolio-create": "/room/portfolio/create",
        "orders": "/room/orders",
        "order-create": "/room/order/create",
        "order-close": "/room/order/close",
        "transactions": "/room/transactions",
        "transaction-close": "/room/transaction/close",
        "portfolio-close": "/room/portfolio/close",
    }
    endpoint = endpoints.get(action_name)
    if not endpoint:
        raise HTTPException(status_code=404, detail="Unsupported room action")

    body = payload.model_dump(exclude_none=True)
    body.setdefault("base_domain", "https://hivagold.com")
    body.update(body.pop("payload", {}))
    body["endpoint"] = endpoint
    try:
        logger.debug("Received room_action request action_name=%s", action_name)
        result = await asyncio.to_thread(service.execute, "room_action", body)
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
