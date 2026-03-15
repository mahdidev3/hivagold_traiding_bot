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

    MARKET_EVENTS_FILE: str = os.getenv("MARKET_EVENTS_FILE", "data/market_events.jsonl")
    REDIS_MARKET_EVENT_CHANNEL: str = os.getenv("MARKET_EVENT_CHANNEL", "bot.market.events")


def get_config() -> Config:
    return Config()
