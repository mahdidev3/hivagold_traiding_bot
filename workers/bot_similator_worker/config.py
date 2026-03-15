import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Similator Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    SIMILATOR_WORKER_HOST: str = os.getenv("SIMILATOR_WORKER_HOST", "0.0.0.0")
    SIMILATOR_WORKER_PORT: int = int(os.getenv("SIMILATOR_WORKER_PORT", "8008"))

    SYMBOL: str = os.getenv("SIMILATOR_SYMBOL", "xag")
    START_PRICE: float = float(os.getenv("SIMILATOR_START_PRICE", "2400"))

    SESSION_CACHE_FILE: str = os.getenv("SESSION_CACHE_FILE", "data/auth_sessions.json")
    SIMILATOR_STATE_FILE: str = os.getenv("SIMILATOR_STATE_FILE", "data/similator_state.json")

    WS_LIVE_BARS_PATH: str = os.getenv("WS_LIVE_BARS_PATH", "/xag/ws/xag/live-bars/")
    WS_PRICE_PATH: str = os.getenv("WS_PRICE_PATH", "/xag/ws/xag/price/")
    BARS_SYMBOL: str = os.getenv("BARS_SYMBOL", "xag")


def get_config() -> Config:
    return Config()
