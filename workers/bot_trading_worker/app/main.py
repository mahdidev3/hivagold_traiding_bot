from contextlib import asynccontextmanager
import asyncio
import json
from logging import Logger

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from config import get_config
from .clients import build_clients
from .logging_setup import setup_logger
from .schemas import (
    HealthResponse,
    LatestSignalsResponse,
    ProcessTradingRequest,
    ProcessTradingResponse,
)
from .service import TradingWorkerService
from .session_service import TradingSessionService


config = get_config()

logger: Logger = setup_logger(config)

redis_client, market_client = build_clients(config)
trading_service = TradingWorkerService(config, redis_client, market_client, logger)
session_service = TradingSessionService(config)


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
    return HealthResponse(
        status="healthy",
        app_name=config.APP_NAME,
        version=config.APP_VERSION,
    )


@app.post("/trading/process", response_model=ProcessTradingResponse)
async def process_request(payload: ProcessTradingRequest):
    try:
        logger.debug("Received process trading request")
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


@app.post("/room/status")
async def room_status(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    market = payload.get("market", "xag")
    return session_service.room_status(payload["mobile"], base_domain, market)


@app.post("/room/portfolios")
async def room_portfolios(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._get(payload["mobile"], base_domain, room_prefix, "/api/portfolio/active/")
    return {"success": True, "portfolios": data}


@app.post("/room/portfolio/create")
async def room_portfolio_create(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    body = {"portfolio_type": payload.get("portfolio_type", "real"), "initial_balance": payload.get("initial_balance", 1000000)}
    data = session_service._post(payload["mobile"], base_domain, room_prefix, "/api/portfolio/create/", body)
    return {"success": True, "portfolio": data}

@app.post("/room/portfolio/close")
async def room_portfolio_close(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._post(payload["mobile"], base_domain, room_prefix, "/api/portfolio/close/", payload)
    return {"success": True, "portfolio": data}

@app.post("/room/orders")
async def room_orders(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._get(payload["mobile"], base_domain, room_prefix, "/api/order/active/")
    return {"success": True, "orders": data}

@app.post("/room/order/create")
async def room_order_create(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._post(payload["mobile"], base_domain, room_prefix, "/api/order/create/", payload)
    return {"success": True, "order": data}

@app.post("/room/order/close")
async def room_order_close(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._post(payload["mobile"], base_domain, room_prefix, "/api/order/close/", payload)
    return {"success": True, "order": data}

@app.post("/room/transactions")
async def room_transactions(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._get(payload["mobile"], base_domain, room_prefix, "/api/transaction/active/")
    return {"success": True, "transactions": data}

@app.post("/room/transaction/close")
async def room_transaction_close(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    room_prefix = payload.get("room_prefix", f"/{payload.get('market', 'xag')}")
    data = session_service._post(payload["mobile"], base_domain, room_prefix, "/api/transaction/close/", payload)
    return {"success": True, "transaction": data}

@app.post("/bot/activate")
async def bot_activate(payload: dict):
    return session_service.bot_activate(payload)

@app.post("/state/cleanup")
async def state_cleanup(payload: dict):
    base_domain = payload.get("base_domain", "https://demo.hivagold.com")
    return session_service.cleanup_state(payload["mobile"], base_domain)


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
