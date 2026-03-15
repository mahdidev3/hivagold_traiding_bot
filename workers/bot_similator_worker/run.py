import uvicorn

from config import get_config


if __name__ == "__main__":
    cfg = get_config()
    uvicorn.run("app.main:app", host=cfg.SIMILATOR_WORKER_HOST, port=cfg.SIMILATOR_WORKER_PORT, reload=False)
