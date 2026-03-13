from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException

from config import get_config
from .logging_setup import setup_logger
from .queue_manager import PortfolioQueueManager
from .schemas import HealthResponse, ProcessPortfolioRequest, ProcessPortfolioResponse
from .service import PortfolioWorkerService

config = get_config()
logger = setup_logger()
service = PortfolioWorkerService(config, logger)
queue_manager = PortfolioQueueManager(service, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await queue_manager.start()
    await service.start()
    yield
    await service.stop()
    await queue_manager.stop()


app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION, lifespan=lifespan)


def require_api_key(x_api_key: str = Header(default="")):
    if x_api_key != config.BOT_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", app_name=config.APP_NAME, version=config.APP_VERSION)


@app.post("/portfolio/process", response_model=ProcessPortfolioResponse)
async def process(payload: ProcessPortfolioRequest, _=Depends(require_api_key)):
    result = await queue_manager.enqueue(payload.model_dump())
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "processing error"))
    return result
