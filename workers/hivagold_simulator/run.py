import uvicorn

from config import get_config


if __name__ == "__main__":
    cfg = get_config()
    uvicorn.run("app.main:app", host=cfg.SIMULATOR_HOST, port=cfg.SIMULATOR_PORT, reload=False)
