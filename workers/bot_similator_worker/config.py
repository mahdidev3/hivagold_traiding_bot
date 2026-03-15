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
    ROOM_PREFIX: str = os.getenv("SIMILATOR_ROOM_PREFIX", "/xag")


def get_config() -> Config:
    return Config()
