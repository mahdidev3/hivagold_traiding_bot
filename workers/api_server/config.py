import os
from dataclasses import dataclass


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Hivagold API Server")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    API_SERVER_HOST: str = os.getenv("API_SERVER_HOST", "0.0.0.0")
    API_SERVER_PORT: int = int(os.getenv("API_SERVER_PORT", "8000"))

    AUTH_WORKER_URL: str = os.getenv("AUTH_WORKER_URL", "http://localhost:8002")
    ROOM_WORKER_URL: str = os.getenv("ROOM_WORKER_URL", "http://localhost:8005")
    TRADING_WORKER_URL: str = os.getenv("TRADING_WORKER_URL", "http://localhost:8006")
    PORTFOLIO_WORKER_URL: str = os.getenv("PORTFOLIO_WORKER_URL", "http://localhost:8007")
    PORTFOLIO_WORKER_API_KEY: str = os.getenv("PORTFOLIO_WORKER_API_KEY", "change-me")
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "change-me-admin")

    DEFAULT_MARKET: str = os.getenv("DEFAULT_MARKET", "xag")
    MARKET_CHOICES: tuple[str, ...] = ("xag", "mazaneh", "ounce")

    HTTP_TIMEOUT_SECONDS: int = int(os.getenv("HTTP_TIMEOUT_SECONDS", "45"))


def get_config() -> Config:
    return Config()
