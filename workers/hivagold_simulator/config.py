import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Hivagold Simulator")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    SIMULATOR_HOST: str = os.getenv("SIMULATOR_HOST", "0.0.0.0")
    SIMULATOR_PORT: int = int(os.getenv("SIMULATOR_PORT", "8010"))
    SYMBOL: str = os.getenv("SIMULATOR_SYMBOL", "xag")
    START_PRICE: float = float(os.getenv("SIMULATOR_START_PRICE", "2400"))


def get_config() -> Config:
    return Config()
