import uvicorn
from config import get_config
import os
import sys
import argparse
from dotenv import load_dotenv

os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
sys.dont_write_bytecode = True


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "mode",
        choices=["local", "docker"],
        help="Run mode: local or docker",
    )
    return parser.parse_args()


config = get_config()

if __name__ == "__main__":
    args = parse_args()

    if args.mode == "local":
        load_dotenv()

    uvicorn.run(
        "app.main:app",
        host=config.CAPTCHA_WORKER_HOST,
        port=config.CAPTCHA_WORKER_PORT,
        reload=config.ENVIRONMENT == "development",
    )
