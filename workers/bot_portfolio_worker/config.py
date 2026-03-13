import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Portfolio Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    PORTFOLIO_WORKER_HOST: str = os.getenv("PORTFOLIO_WORKER_HOST", "0.0.0.0")
    PORTFOLIO_WORKER_PORT: int = int(os.getenv("PORTFOLIO_WORKER_PORT", "8007"))

    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "portfolio_worker.db")
    PRICE_WS_URL: str = os.getenv("PRICE_WS_URL", "")
    PRICE_WS_SYMBOL: str = os.getenv("PRICE_WS_SYMBOL", "xag")
    PRICE_WS_SUBSCRIBE_MESSAGE: str = os.getenv("PRICE_WS_SUBSCRIBE_MESSAGE", '{"action":"SubAdd","subs":["0~hivagold~xag~gold"]}')

    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")
    MIN_SL_PIPS: float = float(os.getenv("MIN_SL_PIPS", "0.1"))
    MIN_TP_PIPS: float = float(os.getenv("MIN_TP_PIPS", "0.1"))


def get_config() -> Config:
    return Config()
