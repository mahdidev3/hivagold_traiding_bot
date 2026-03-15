import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Trading Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "2.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    TRADING_WORKER_HOST: str = os.getenv("TRADING_WORKER_HOST", "0.0.0.0")
    TRADING_WORKER_PORT: int = int(os.getenv("TRADING_WORKER_PORT", "8006"))

    USERS_JSON_PATH: str = os.getenv("TRADING_USERS_JSON_PATH", "workers/bot_trading_worker/users.json")
    USERS_STORAGE_DIR: str = os.getenv("USERS_STORAGE_DIR", "../bot_auth_worker/Users")

    ROOM_PREFIX: str = os.getenv("TRADING_ROOM_PREFIX", "/xag")
    WS_LIVE_BARS_PATH: str = os.getenv("WS_LIVE_BARS_PATH", "/xag/ws/xag/live-bars/")
    WS_PRICE_PATH: str = os.getenv("WS_PRICE_PATH", "/xag/ws/xag/price/")
    WS_WALL_PATH: str = os.getenv("WS_WALL_PATH", "/xag/ws/xag/wall/")
    WS_EXTERNAL_PRICE_URL: str = os.getenv("WS_EXTERNAL_PRICE_URL", "")
    BARS_API_PATH: str = os.getenv("BARS_API_PATH", "/xag/api/xag-bars/")

    BARS_POLL_INTERVAL_SECONDS: int = int(os.getenv("BARS_POLL_INTERVAL_SECONDS", "5"))
    LOOKBACK_SECONDS: int = int(os.getenv("LOOKBACK_SECONDS", str(6 * 3600)))
    BARS_RESOLUTION: str = os.getenv("BARS_RESOLUTION", "1")
    BARS_SYMBOL: str = os.getenv("BARS_SYMBOL", "xag")
    AUTO_START: bool = os.getenv("TRADING_AUTO_START", "true").lower() == "true"

    SIMULATOR_WORKER_URL: str = os.getenv("SIMULATOR_WORKER_URL", "http://localhost:8007")
    SIMULATOR_API_KEY: str = os.getenv("SIMULATOR_API_KEY", os.getenv("BOT_API_KEY", "change-me"))


config = Config()


def get_config() -> Config:
    return config
