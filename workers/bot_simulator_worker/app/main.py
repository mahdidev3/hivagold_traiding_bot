from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException

from config import get_config
from .logging_setup import setup_logger
from .schemas import (
    GenericResultResponse,
    HealthResponse,
    PositionCloseRequest,
    PositionCreateRequest,
    PositionStopLossUpdateRequest,
    PositionUpdateRequest,
    PriceTickRequest,
    SimulationTaskCloseRequest,
    SimulationTaskCreateRequest,
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


@app.post("/simulator/tasks", response_model=GenericResultResponse)
async def create_simulation_task(payload: SimulationTaskCreateRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.create_task(payload.model_dump())}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/simulator/tasks/{task_id}/close", response_model=GenericResultResponse)
async def close_simulation_task(task_id: str, payload: SimulationTaskCloseRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.close_task(task_id, payload.reason)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/simulator/tasks/{task_id}/positions", response_model=GenericResultResponse)
async def create_position(task_id: str, payload: PositionCreateRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.create_position(task_id, payload.model_dump())}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.patch("/simulator/positions/{position_id}", response_model=GenericResultResponse)
async def update_position(position_id: str, payload: PositionUpdateRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.update_position(position_id, payload.model_dump())}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/simulator/positions/{position_id}/stop-loss", response_model=GenericResultResponse)
async def change_stop_loss(position_id: str, payload: PositionStopLossUpdateRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.change_stop_loss(position_id, payload.stop_loss)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/simulator/positions/{position_id}/close", response_model=GenericResultResponse)
async def close_position(position_id: str, payload: PositionCloseRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.close_position(position_id, payload.close_price, payload.reason)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/simulator/price", response_model=GenericResultResponse)
async def price_tick(payload: PriceTickRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.process_price_tick(payload.task_id, payload.market, payload.price, source="api")}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/simulator/tasks/{task_id}", response_model=GenericResultResponse)
async def task_info(task_id: str, _=Depends(require_api_key)):
    return {"success": True, "result": service.task_info(task_id)}


@app.get("/simulator/db/records", response_model=GenericResultResponse)
async def db_records(_=Depends(require_api_key)):
    return {"success": True, "result": service.all_records()}
