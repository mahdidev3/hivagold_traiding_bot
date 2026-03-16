import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Trading Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "4.0.0")
    TRADING_WORKER_HOST: str = os.getenv("TRADING_WORKER_HOST", "0.0.0.0")
    TRADING_WORKER_PORT: int = int(os.getenv("TRADING_WORKER_PORT", "8005"))
    USERS_STORAGE_DIR: str = os.getenv("USERS_STORAGE_DIR", "../bot_auth_worker/Users")
    WS_EXTERNAL_PRICE_URL: str = os.getenv("WS_EXTERNAL_PRICE_URL", "")
    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")


def get_config() -> Config:
    return Config()
