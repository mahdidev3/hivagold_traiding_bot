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
    PortfolioOrderRequest,
    PortfolioPriceTickRequest,
)
from .service import ApiServerService

config = get_config()
logger: Logger = setup_logger(config)

auth_client, trading_client, portfolio_client = build_clients(config, logger)
service = ApiServerService(config, auth_client, trading_client, portfolio_client, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def require_admin_key(x_admin_key: str = Header(default="")):
    if x_admin_key != config.ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid admin API key")


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/login", response_model=ApiActionResponse)
async def login(payload: LoginRequest):
    result = await asyncio.to_thread(service.execute, "login", payload.model_dump(exclude_none=True))
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/logout", response_model=ApiActionResponse)
async def logout(payload: LogoutRequest):
    result = await asyncio.to_thread(service.execute, "logout", payload.model_dump(exclude_none=True))
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/signals/latest", response_model=ApiActionResponse)
async def signals_latest():
    result = await asyncio.to_thread(service.execute, "get_signals", {})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/portfolio/orders", response_model=ApiActionResponse)
async def portfolio_order(payload: PortfolioOrderRequest):
    result = await asyncio.to_thread(service.execute, "portfolio_order_create", payload.model_dump(exclude_none=True))
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/portfolio/price", response_model=ApiActionResponse)
async def portfolio_price(payload: PortfolioPriceTickRequest):
    result = await asyncio.to_thread(service.execute, "portfolio_price_tick", payload.model_dump())
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/portfolio/users/{user_id}/stats", response_model=ApiActionResponse)
async def portfolio_user_stats(user_id: str):
    result = await asyncio.to_thread(service.execute, "portfolio_user_stats", {"user_id": user_id})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/portfolio/users/{user_id}/history", response_model=ApiActionResponse)
async def portfolio_user_history(user_id: str):
    result = await asyncio.to_thread(service.execute, "portfolio_user_history", {"user_id": user_id})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/portfolio/db/records", response_model=ApiActionResponse)
async def portfolio_db_records():
    result = await asyncio.to_thread(service.execute, "portfolio_db_records", {})
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.get("/admin/db/all", response_model=ApiActionResponse)
async def admin_db_all(x_admin_key: str = Header(default="", alias="x-admin-key")):
    require_admin_key(x_admin_key)
    result = await asyncio.to_thread(service.execute, "portfolio_admin_db", {})
    return ApiActionResponse(success=result.get("success", False), data=result)
