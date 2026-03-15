from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException

from config import get_config
from .logging_setup import setup_logger
from .schemas import (
    GenericResultResponse,
    HealthResponse,
    PositionCloseRequest,
    PositionCreateRequest,
    PositionUpdateRequest,
    PriceTickRequest,
    StrategyTaskRequest,
)
from .service import SimulatorWorkerService

config = get_config()
logger = setup_logger("bot_simulator_worker")
service = SimulatorWorkerService(config, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await service.start()
    yield
    await service.stop()


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def require_api_key(x_api_key: str = Header(default="")):
    if x_api_key != config.BOT_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/portfolio/orders", response_model=GenericResultResponse)
async def create_position(payload: PositionCreateRequest, _=Depends(require_api_key)):
    try:
        result = await service.create_position(payload.model_dump())
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.patch("/portfolio/users/{mobile}/positions/{position_id}", response_model=GenericResultResponse)
async def update_position(mobile: str, position_id: int, payload: PositionUpdateRequest, _=Depends(require_api_key)):
    try:
        result = await service.update_position(mobile, position_id, payload.model_dump())
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/portfolio/users/{mobile}/positions/{position_id}/close", response_model=GenericResultResponse)
async def close_position(mobile: str, position_id: int, payload: PositionCloseRequest, _=Depends(require_api_key)):
    try:
        result = await service.close_position(mobile, position_id, payload.close_price, payload.reason)
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/portfolio/price", response_model=GenericResultResponse)
async def price_tick(payload: dict, _=Depends(require_api_key)):
    try:
        mobile = payload.get("mobile") or payload.get("user_id")
        data = PriceTickRequest.model_validate(payload)
        result = await service.process_price_tick(mobile, data.price, symbol=data.symbol)
        return {"success": True, "result": result}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/portfolio/users/{mobile}/pnl", response_model=GenericResultResponse)
async def user_pnl(mobile: str, _=Depends(require_api_key)):
    return {"success": True, "result": service.user_stats(mobile)}


@app.get("/portfolio/users/{mobile}/stats", response_model=GenericResultResponse)
async def user_stats(mobile: str, _=Depends(require_api_key)):
    return {"success": True, "result": service.user_stats(mobile)}


@app.get("/portfolio/users/{mobile}/history", response_model=GenericResultResponse)
async def user_history(mobile: str, _=Depends(require_api_key)):
    return {"success": True, "result": service.user_history(mobile)}


@app.post("/strategy/tasks", response_model=GenericResultResponse)
async def create_task(payload: StrategyTaskRequest, _=Depends(require_api_key)):
    result = await service.create_strategy_task(payload.model_dump())
    return {"success": True, "result": result}


@app.delete("/strategy/tasks/{task_id}", response_model=GenericResultResponse)
async def delete_task(task_id: str, _=Depends(require_api_key)):
    result = await service.close_strategy_task(task_id)
    return {"success": True, "result": result}


@app.get("/strategy/tasks", response_model=GenericResultResponse)
async def list_tasks(_=Depends(require_api_key)):
    return {"success": True, "result": {"tasks": service.list_tasks()}}


@app.get("/portfolio/db/records", response_model=GenericResultResponse)
async def db_records(_=Depends(require_api_key)):
    return {"success": True, "result": service.all_records()}


@app.get("/portfolio/admin/db", response_model=GenericResultResponse)
async def admin_db(_=Depends(require_api_key)):
    return {"success": True, "result": service.all_records()}
