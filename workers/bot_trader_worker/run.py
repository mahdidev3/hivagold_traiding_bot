import os
import sys

import uvicorn

from config import get_config

os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.dont_write_bytecode = True


if __name__ == "__main__":
    config = get_config()
    uvicorn.run(
        "app.main:app",
        host=config.TRADER_WORKER_HOST,
        port=config.TRADER_WORKER_PORT,
        reload=config.ENVIRONMENT.lower() == "development",
    )
