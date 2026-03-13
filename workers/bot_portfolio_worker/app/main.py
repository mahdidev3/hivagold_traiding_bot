from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException

from config import get_config
from .logging_setup import setup_logger
from .schemas import (
    BotOrderRequest,
    CreateOrderRequest,
    HealthResponse,
    PriceTickRequest,
    UpsertRuleRequest,
    UserStatsResponse,
)
from .service import PortfolioWorkerService

config = get_config()
logger = setup_logger()
service = PortfolioWorkerService(config, logger)


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


@app.post("/portfolio/rules")
async def upsert_rule(payload: UpsertRuleRequest, _=Depends(require_api_key)):
    return service.upsert_rule(payload.user_id, payload.rule.model_dump())


@app.post("/portfolio/orders")
async def create_order(payload: CreateOrderRequest, _=Depends(require_api_key)):
    result = service.create_order(payload.model_dump())
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "order rejected"))
    return result


@app.post("/portfolio/orders/bot")
async def create_bot_order(payload: BotOrderRequest, _=Depends(require_api_key)):
    data = payload.model_dump()
    data.update({"entry_type": "market", "entry_price": None})
    result = service.create_order(data)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "order rejected"))
    return result


@app.post("/portfolio/price")
async def process_price(payload: PriceTickRequest, _=Depends(require_api_key)):
    return await service.on_price_tick(symbol=payload.symbol, price=payload.price)


@app.get("/portfolio/users/{user_id}/stats", response_model=UserStatsResponse)
async def user_stats(user_id: str, _=Depends(require_api_key)):
    return UserStatsResponse(**service.user_stats(user_id))
