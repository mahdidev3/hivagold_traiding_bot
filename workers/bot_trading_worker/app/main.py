from contextlib import asynccontextmanager
import asyncio
import json
from logging import Logger

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .schemas import HealthResponse, LatestSignalsResponse, ProcessTradingRequest, ProcessTradingResponse
from .service import TradingWorkerService


config = get_config()
logger: Logger = setup_logger(config)

session_store, market_client, execution_client = build_clients(config)
trading_service = TradingWorkerService(config, session_store, market_client, execution_client, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Trading Worker started")
    if config.AUTO_START:
        await trading_service.start()
    yield
    await trading_service.stop()
    logger.info("Trading Worker stopped")


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def _http_from_result(result: dict):
    if result.get("success"):
        return result
    raise HTTPException(status_code=400, detail=result.get("error", "Unknown error"))


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/trading/process", response_model=ProcessTradingResponse)
async def process_request(payload: ProcessTradingRequest):
    try:
        result = await trading_service.process(payload.model_dump())
        return _http_from_result(result)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Error processing trading request: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/signals/latest", response_model=LatestSignalsResponse)
async def latest_signals():
    return LatestSignalsResponse(success=True, signals=trading_service.latest_signals())


@app.websocket("/signals/ws")
async def signals_ws(websocket: WebSocket):
    await websocket.accept()
    queue = trading_service.register_listener()

    for signal in trading_service.latest_signals():
        await websocket.send_text(json.dumps(signal, ensure_ascii=False))

    sender_task = asyncio.create_task(_ws_sender_loop(websocket, queue))

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        sender_task.cancel()
        try:
            await sender_task
        except Exception:
            pass
        trading_service.unregister_listener(queue)


async def _ws_sender_loop(websocket: WebSocket, queue: asyncio.Queue):
    while True:
        signal = await queue.get()
        await websocket.send_text(json.dumps(signal, ensure_ascii=False))
