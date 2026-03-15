from contextlib import asynccontextmanager

from fastapi import FastAPI

from config import get_config
from .schemas import HealthResponse
from .service import SimilatorService

config = get_config()
service = SimilatorService(
    symbol=config.SYMBOL,
    start_price=config.START_PRICE,
    session_cache_file=config.SESSION_CACHE_FILE,
    state_file=config.SIMILATOR_STATE_FILE,
    ws_price_path=config.WS_PRICE_PATH,
    ws_live_bars_path=config.WS_LIVE_BARS_PATH,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await service.stop_market_stream()


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


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


@app.post("/simulator/market/start")
async def start_market_stream(payload: dict):
    return await service.start_market_stream(
        mobile=str(payload.get("mobile", "")),
        domain=str(payload.get("domain", "")),
        symbol=payload.get("symbol"),
    )


@app.post("/simulator/market/stop")
async def stop_market_stream():
    return await service.stop_market_stream()


@app.get("/simulator/market/state")
async def stream_state():
    return await service.stream_state()
