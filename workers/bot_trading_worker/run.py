import uvicorn
from config import get_config


if __name__ == "__main__":
    cfg = get_config()
    uvicorn.run("app.main:app", host=cfg.TRADING_WORKER_HOST, port=cfg.TRADING_WORKER_PORT, reload=False)
