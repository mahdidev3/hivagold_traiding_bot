from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException, Query

from config import get_config
from .logging_setup import setup_logger
from .schemas import GenericResultResponse, HealthResponse, TraderBotActionRequest, TraderBotCreateRequest
from .service import TraderWorkerService

config = get_config()
logger = setup_logger("bot_trader_worker")
service = TraderWorkerService(config, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await service.start()
    yield
    await service.stop()


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def require_api_key(x_api_key: str = Header(default="")) -> None:
    if config.BOT_API_KEY and x_api_key != config.BOT_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/trader/bots", response_model=GenericResultResponse)
async def create_bot(payload: TraderBotCreateRequest, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.create_bot(payload.model_dump())}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.delete("/trader/bots/{bot_id}", response_model=GenericResultResponse)
async def remove_bot(bot_id: str, payload: TraderBotActionRequest | None = None, _=Depends(require_api_key)):
    try:
        reason = payload.reason if payload else None
        return {"success": True, "result": await service.remove_bot(bot_id, reason)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/trader/bots/{bot_id}/start", response_model=GenericResultResponse)
async def start_bot(bot_id: str, payload: TraderBotActionRequest | None = None, _=Depends(require_api_key)):
    try:
        reason = payload.reason if payload else None
        return {"success": True, "result": await service.start_bot(bot_id, reason)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/trader/bots/{bot_id}/stop", response_model=GenericResultResponse)
async def stop_bot(bot_id: str, payload: TraderBotActionRequest | None = None, _=Depends(require_api_key)):
    try:
        reason = payload.reason if payload else None
        return {"success": True, "result": await service.stop_bot(bot_id, reason)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/trader/bots", response_model=GenericResultResponse)
async def list_bot(_=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.list_bots()}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/trader/bots/{bot_id}/logs", response_model=GenericResultResponse)
async def get_logs(bot_id: str, limit: int = Query(default=100, ge=1, le=1000), _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.get_logs(bot_id, limit)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.get("/trader/bots/{bot_id}/status", response_model=GenericResultResponse)
async def get_status(bot_id: str, _=Depends(require_api_key)):
    try:
        return {"success": True, "result": await service.get_status(bot_id)}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
