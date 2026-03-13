import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Portfolio Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "2.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    PORTFOLIO_WORKER_HOST: str = os.getenv("PORTFOLIO_WORKER_HOST", "0.0.0.0")
    PORTFOLIO_WORKER_PORT: int = int(os.getenv("PORTFOLIO_WORKER_PORT", "8007"))

    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "portfolio_worker.db")
    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")

    REDIS_HOST: str = os.getenv("REDIS_HOST", "redis")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    REDIS_MARKET_EVENT_CHANNEL: str = os.getenv("REDIS_MARKET_EVENT_CHANNEL", "bot.market.events")


def get_config() -> Config:
    return Config()
