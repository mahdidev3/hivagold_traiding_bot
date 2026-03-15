import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Simulator Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "3.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    SIMULATOR_WORKER_HOST: str = os.getenv("SIMULATOR_WORKER_HOST", os.getenv("PORTFOLIO_WORKER_HOST", "0.0.0.0"))
    SIMULATOR_WORKER_PORT: int = int(os.getenv("SIMULATOR_WORKER_PORT", os.getenv("PORTFOLIO_WORKER_PORT", "8007")))

    BOT_API_KEY: str = os.getenv("BOT_API_KEY", "change-me")
    USERS_STORAGE_DIR: str = os.getenv("USERS_STORAGE_DIR", "../bot_auth_worker/Users")
    SIMULATOR_HISTORY_FILE: str = os.getenv("SIMULATOR_HISTORY_FILE", "SimulatorHistory.json")

    WS_PRICE_PATH: str = os.getenv("WS_PRICE_PATH", "/xag/ws/xag/price/")
    PRICE_WS_SUBSCRIBE_MESSAGE: str = os.getenv("PRICE_WS_SUBSCRIBE_MESSAGE", '{"action":"SubAdd","subs":["0~hivagold~xag~gold"]}')
    PRICE_WS_SYMBOL: str = os.getenv("PRICE_WS_SYMBOL", "xag")
    HELPER_WS_URL: str = os.getenv("HELPER_WS_URL", "ws://localhost:8010/ws/price")
    HELPER_SYMBOL: str = os.getenv("HELPER_SYMBOL", "xag")
    HELPER_CANDLE_MOVE_THRESHOLD: float = float(os.getenv("HELPER_CANDLE_MOVE_THRESHOLD", "1.5"))
    ORDER_TOLERANCE_MAX: float = float(os.getenv("ORDER_TOLERANCE_MAX", "5"))
    STOP_TOLERANCE_MAX: float = float(os.getenv("STOP_TOLERANCE_MAX", "2"))
    BARS_API_PATH: str = os.getenv("BARS_API_PATH", "/xag/api/xag-bars/")


def get_config() -> Config:
    return Config()
