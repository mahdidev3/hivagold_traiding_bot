from contextlib import asynccontextmanager
import asyncio
from logging import Logger

from fastapi import FastAPI, HTTPException

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .schemas import (
    ApiActionResponse,
    BotCreateRequest,
    BotRefRequest,
    HealthResponse,
    LoginRequest,
    LogoutRequest,
)
from .service import ApiServerService

config = get_config()
logger: Logger = setup_logger(config)

auth_client, trading_client = build_clients(config, logger)
service = ApiServerService(config, auth_client, trading_client, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION
    )


@app.post("/login", response_model=ApiActionResponse)
async def login(payload: LoginRequest):
    try:
        result = await asyncio.to_thread(
            service.execute, "login", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/logout", response_model=ApiActionResponse)
async def logout(payload: LogoutRequest):
    try:
        result = await asyncio.to_thread(
            service.execute, "logout", payload.model_dump(exclude_none=True)
        )
        return ApiActionResponse(success=result.get("success", False), data=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/bots/create", response_model=ApiActionResponse)
async def create_bot(payload: BotCreateRequest):
    result = await asyncio.to_thread(
        service.execute, "create_bot", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/bots/remove", response_model=ApiActionResponse)
async def remove_bot(payload: BotRefRequest):
    result = await asyncio.to_thread(
        service.execute, "remove_bot", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/bots/start", response_model=ApiActionResponse)
async def start_bot(payload: BotRefRequest):
    result = await asyncio.to_thread(
        service.execute, "start_bot", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/bots/stop", response_model=ApiActionResponse)
async def stop_bot(payload: BotRefRequest):
    result = await asyncio.to_thread(
        service.execute, "stop_bot", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/tasks/status", response_model=ApiActionResponse)
async def get_task_status(payload: BotRefRequest):
    result = await asyncio.to_thread(
        service.execute, "get_task_status", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)


@app.post("/tasks/logs", response_model=ApiActionResponse)
async def get_task_logs(payload: BotRefRequest):
    result = await asyncio.to_thread(
        service.execute, "get_task_logs", payload.model_dump(exclude_none=True)
    )
    return ApiActionResponse(success=result.get("success", False), data=result)
