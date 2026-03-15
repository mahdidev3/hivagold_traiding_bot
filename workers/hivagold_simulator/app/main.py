import asyncio
import random
import time
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from config import get_config

config = get_config()
app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION)

STATE: dict[str, Any] = {
    "room_open": True,
    "price": config.START_PRICE,
    "symbol": config.SYMBOL,
    "portfolios": [],
    "orders": [],
}
WS_CLIENTS: set[WebSocket] = set()


@app.get("/health")
async def health():
    return {"status": "healthy", "app_name": config.APP_NAME, "version": config.APP_VERSION}


@app.post("/room/status")
async def room_status(payload: dict[str, Any]):
    return {
        "success": True,
        "market": payload.get("market", config.SYMBOL),
        "is_open": STATE["room_open"],
        "active": STATE["room_open"],
        "reason": "in_shift" if STATE["room_open"] else "out_of_shift",
    }


@app.post("/room/portfolios")
async def get_portfolios(_: dict[str, Any]):
    return {"success": True, "portfolios": STATE["portfolios"]}


@app.post("/room/portfolio/create")
async def create_portfolio(payload: dict[str, Any]):
    item = {"id": len(STATE["portfolios"]) + 1, "name": payload.get("name", "demo")}
    STATE["portfolios"].append(item)
    return {"success": True, "portfolio": item}


@app.post("/room/orders")
async def get_orders(_: dict[str, Any]):
    return {"success": True, "orders": STATE["orders"]}


@app.post("/room/order/create")
async def create_order(payload: dict[str, Any]):
    order = {
        "id": len(STATE["orders"]) + 1,
        "side": payload.get("side", "buy"),
        "status": "open",
        "open_price": STATE["price"],
        "symbol": payload.get("symbol", config.SYMBOL),
    }
    STATE["orders"].append(order)
    return {"success": True, "order": order}


@app.post("/room/order/close")
async def close_order(payload: dict[str, Any]):
    oid = payload.get("order_id")
    for o in STATE["orders"]:
        if o["id"] == oid and o["status"] == "open":
            o["status"] = "closed"
            o["close_price"] = STATE["price"]
            return {"success": True, "order": o}
    return {"success": False, "error": "order not found"}


@app.get("/xag/api/xag-bars/")
async def bars():
    now = int(time.time())
    base = STATE["price"]
    candles = []
    for i in range(60):
        t = now - (59 - i) * 60
        o = round(base + random.uniform(-2, 2), 2)
        c = round(o + random.uniform(-1, 1), 2)
        h = max(o, c) + round(random.uniform(0, 1), 2)
        l = min(o, c) - round(random.uniform(0, 1), 2)
        candles.append({"ts": t, "open": o, "high": h, "low": l, "close": c})
    return candles


@app.websocket("/xag/ws/xag/price/")
async def ws_price(websocket: WebSocket):
    await websocket.accept()
    WS_CLIENTS.add(websocket)
    try:
        while True:
            await asyncio.sleep(1)
            STATE["price"] = round(STATE["price"] + random.uniform(-0.8, 0.8), 2)
            await websocket.send_json({"price": STATE["price"], "symbol": config.SYMBOL})
            for o in STATE["orders"]:
                if o.get("status") != "open":
                    continue
                # simple auto-close simulator by tp/sl placeholders
                if random.random() < 0.02:
                    o["status"] = "closed"
                    o["close_price"] = STATE["price"]
    except WebSocketDisconnect:
        pass
    finally:
        WS_CLIENTS.discard(websocket)


@app.websocket("/xag/ws/xag/live-bars/")
async def ws_live_bars(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(2)
            p = STATE["price"]
            bar = {"ts": int(time.time()), "open": p - 0.5, "high": p + 0.5, "low": p - 0.8, "close": p}
            await websocket.send_json(bar)
    except WebSocketDisconnect:
        return


@app.websocket("/xag/ws/xag/wall/")
async def ws_wall(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await asyncio.sleep(2)
            p = STATE["price"]
            await websocket.send_json({"bid": p - 0.2, "ask": p + 0.2, "symbol": config.SYMBOL})
    except WebSocketDisconnect:
        return
