import os
from dataclasses import dataclass
from functools import lru_cache

from dotenv import load_dotenv


@dataclass(frozen=True)
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Trader Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    TRADER_WORKER_HOST: str = os.getenv("TRADER_WORKER_HOST", "0.0.0.0")
    TRADER_WORKER_PORT: int = int(os.getenv("TRADER_WORKER_PORT", "8008"))

    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


@lru_cache(maxsize=1)
def get_config() -> Config:
    load_dotenv()
    return Config()
