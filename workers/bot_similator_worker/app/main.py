import asyncio
import json
import random
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from config import get_config
from .schemas import HealthResponse
from .service import SimilatorService

config = get_config()
service = SimilatorService(symbol=config.SYMBOL, start_price=config.START_PRICE)
app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION)


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/room/status")
async def room_status(payload: dict):
    return await service.room_status(payload.get("market"))


@app.post("/room/portfolios")
async def room_portfolios(_: dict):
    return await service.list_portfolios()


@app.post("/room/portfolio/create")
async def room_portfolio_create(payload: dict):
    return await service.create_portfolio(payload)


@app.post("/room/orders")
async def room_orders(_: dict):
    return await service.get_orders()


@app.post("/room/order/create")
async def room_order_create(payload: dict):
    return await service.create_position(payload)


@app.post("/room/order/close")
async def room_order_close(payload: dict):
    return await service.close_position(int(payload.get("order_id", 0)))


@app.post("/room/transactions")
async def room_transactions(_: dict):
    return await service.get_transactions()


@app.post("/room/transaction/close")
async def room_transaction_close(payload: dict):
    return await service.close_position(int(payload.get("order_id", 0)))


@app.post("/room/portfolio/close")
async def room_portfolio_close(_: dict):
    return await service.close_all_in_portfolio()


@app.get("/xag/api/xag-bars/")
async def bars():
    return await service.generate_candles()


@app.post("/simulator/positions")
async def create_sim_position(payload: dict):
    return await service.create_position(payload)


@app.get("/simulator/positions")
async def list_sim_positions():
    return await service.get_orders()


@app.patch("/simulator/positions/{position_id}")
async def update_sim_position(position_id: int, payload: dict):
    return await service.update_position(position_id, payload)


@app.delete("/simulator/positions/{position_id}")
async def delete_sim_position(position_id: int):
    return await service.delete_position(position_id)


@app.post("/simulator/price")
async def set_price(payload: dict):
    symbol = payload.get("symbol")
    return await service.process_price(float(payload["price"]), symbol=symbol)


@app.websocket("/xag/ws/xag/price/")
async def ws_price(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(1)
            next_price = round(service.price + random.uniform(-0.8, 0.8), 2)
            await service.process_price(next_price, symbol=config.SYMBOL)
            await websocket.send_text(json.dumps({"price": service.price, "symbol": config.SYMBOL}))
    except WebSocketDisconnect:
        return


@app.websocket("/xag/ws/xag/live-bars/")
async def ws_live_bars(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(2)
            p = service.price
            bar = {
                "ts": int(time.time()),
                "open": round(p - 0.5, 2),
                "high": round(p + 0.6, 2),
                "low": round(p - 0.7, 2),
                "close": round(p, 2),
            }
            await websocket.send_text(json.dumps(bar))
    except WebSocketDisconnect:
        return


@app.websocket("/xag/ws/xag/wall/")
async def ws_wall(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(2)
            p = service.price
            wall = {"bid": round(p - 0.2, 2), "ask": round(p + 0.2, 2), "symbol": config.SYMBOL}
            await websocket.send_text(json.dumps(wall))
    except WebSocketDisconnect:
        return
