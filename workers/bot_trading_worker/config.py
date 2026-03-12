import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Trading Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    TRADING_WORKER_HOST: str = os.getenv("TRADING_WORKER_HOST", "0.0.0.0")
    TRADING_WORKER_PORT: int = int(os.getenv("TRADING_WORKER_PORT", "8006"))

    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")

    USERS_JSON_PATH: str = os.getenv(
        "TRADING_USERS_JSON_PATH",
        "workers/bot_trading_worker/users.json",
    )

    ROOM_PREFIX: str = os.getenv("TRADING_ROOM_PREFIX", "/xag")
    WS_LIVE_BARS_PATH: str = os.getenv("WS_LIVE_BARS_PATH", "/xag/ws/xag/live-bars/")
    WS_PRICE_PATH: str = os.getenv("WS_PRICE_PATH", "/xag/ws/xag/price/")
    WS_WALL_PATH: str = os.getenv("WS_WALL_PATH", "/xag/ws/xag/wall/")
    BARS_API_PATH: str = os.getenv("BARS_API_PATH", "/xag/api/xag-bars/")

    SIGNAL_INTERVAL_SECONDS: int = int(os.getenv("SIGNAL_INTERVAL_SECONDS", "5"))
    BARS_POLL_INTERVAL_SECONDS: int = int(os.getenv("BARS_POLL_INTERVAL_SECONDS", "5"))
    LOOKBACK_SECONDS: int = int(os.getenv("LOOKBACK_SECONDS", str(6 * 3600)))
    BARS_RESOLUTION: str = os.getenv("BARS_RESOLUTION", "1")
    BARS_SYMBOL: str = os.getenv("BARS_SYMBOL", "xag")
    AUTO_START: bool = os.getenv("TRADING_AUTO_START", "true").lower() == "true"

    DEFAULT_UNITS: float = float(os.getenv("TRADING_DEFAULT_UNITS", "1"))
    LIMIT_ORDER_SPREAD_FACTOR: float = float(
        os.getenv("TRADING_LIMIT_ORDER_SPREAD_FACTOR", "0.25")
    )


config = Config()


def get_config() -> Config:
    return config
