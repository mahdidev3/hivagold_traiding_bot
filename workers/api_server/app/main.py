from contextlib import asynccontextmanager
from logging import Logger

from fastapi import FastAPI, HTTPException

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .queue_manager import ApiQueueManager
from .schemas import (
    ApiActionResponse,
    HealthResponse,
    LoginRequest,
    LogoutRequest,
    RoomActionRequest,
    RoomStatusRequest,
    RoomStatusResponse,
)
from .service import ApiServerService

config = get_config()
logger: Logger = setup_logger(config)

auth_client, room_client, trading_client = build_clients(config, logger)
service = ApiServerService(config, auth_client, room_client, trading_client, logger)
queue_manager = ApiQueueManager(service, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting api queue manager")
    await queue_manager.start()
    yield
    logger.info("Stopping api queue manager")
    await queue_manager.stop()


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION
    )


@app.post("/login", response_model=ApiActionResponse)
async def login(payload: LoginRequest):
    try:
        logger.debug("Received login request")
        result = await queue_manager.enqueue(
            "login", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/logout", response_model=ApiActionResponse)
async def logout(payload: LogoutRequest):
    try:
        logger.debug("Received logout request")
        result = await queue_manager.enqueue(
            "logout", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/portfolio/create", response_model=ApiActionResponse)
async def create_portfolio(payload: RoomActionRequest):
    body = payload.model_dump(exclude_none=True)
    body.update(body.pop("payload", {}))
    try:
        logger.debug("Received create_portfolio request")
        result = await queue_manager.enqueue("create_portfolio", body)
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/signals/latest", response_model=ApiActionResponse)
async def signals_latest():
    try:
        logger.debug("Received signals_latest request")
        result = await queue_manager.enqueue("get_signals", {})
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/room/status", response_model=RoomStatusResponse)
async def room_status(payload: RoomStatusRequest):
    try:
        logger.debug("Received room_status request")
        result = await queue_manager.enqueue("check_room_status", payload.model_dump())
        return RoomStatusResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


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
    body.setdefault("base_domain", "https://demo.hivagold.com")
    body.update(body.pop("payload", {}))
    body["endpoint"] = endpoint
    try:
        logger.debug("Received room_action request action_name=%s", action_name)
        result = await queue_manager.enqueue("room_action", body)
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
