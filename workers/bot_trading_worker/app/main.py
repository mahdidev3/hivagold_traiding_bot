from fastapi import FastAPI
from pydantic import BaseModel

from config import get_config
from .clients import SessionStore
from .service import TradingWorkerService


class ProcessRequest(BaseModel):
    action: str

    class Config:
        extra = "allow"


config = get_config()
store = SessionStore(config.USERS_STORAGE_DIR)
service = TradingWorkerService(config, store, market_client=None, exec_client=None)

app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION)


@app.get("/health")
async def health():
    return {"status": "healthy", "app_name": config.APP_NAME, "version": config.APP_VERSION}


@app.post("/trading/process")
async def process(payload: ProcessRequest):
    return await service.process(payload.model_dump())
