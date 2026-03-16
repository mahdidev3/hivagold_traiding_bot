import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Simulator Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "4.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    SIMULATOR_WORKER_HOST: str = os.getenv("SIMULATOR_WORKER_HOST", os.getenv("PORTFOLIO_WORKER_HOST", "0.0.0.0"))
    SIMULATOR_WORKER_PORT: int = int(os.getenv("SIMULATOR_WORKER_PORT", os.getenv("PORTFOLIO_WORKER_PORT", "8007")))

    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")
    USERS_STORAGE_DIR: str = os.getenv("USERS_STORAGE_DIR", "../bot_auth_worker/Users")
    WS_PRICE_PATH_TEMPLATE: str = os.getenv("WS_PRICE_PATH_TEMPLATE", "/{market}/ws/{market}/price/")


def get_config() -> Config:
    return Config()
