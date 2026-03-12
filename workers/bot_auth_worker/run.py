import os
import sys

os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.dont_write_bytecode = True

import uvicorn
from config import get_config

config = get_config()

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=config.AUTH_WORKER_HOST,
        port=config.AUTH_WORKER_PORT,
        reload=config.ENVIRONMENT == "development",
    )
