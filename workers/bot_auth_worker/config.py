import os
from dataclasses import dataclass


@dataclass
class Config:
    CAPTCHA_SOLVE_URL: str = os.getenv(
        "CAPTCHA_SOLVE_URL", "http://captcha-worker:8001/solve"
    )
    CAPTCHA_WORKER_TIMEOUT_SECONDS: int = int(
        os.getenv("CAPTCHA_WORKER_TIMEOUT_SECONDS", "60")
    )
    CAPTCHA_WORKER_MAX_RETRIES: int = int(os.getenv("CAPTCHA_WORKER_MAX_RETRIES", "3"))
    MAIN_API_CONNECT_TIMEOUT_SECONDS: int = int(
        os.getenv("MAIN_API_CONNECT_TIMEOUT_SECONDS", "10")
    )
    MAIN_API_READ_TIMEOUT_SECONDS: int = int(
        os.getenv("MAIN_API_READ_TIMEOUT_SECONDS", "60")
    )
    MAIN_API_MAX_RETRIES: int = int(os.getenv("MAIN_API_MAX_RETRIES", "3"))
    MAIN_API_RETRY_DELAY_SECONDS: float = float(
        os.getenv("MAIN_API_RETRY_DELAY_SECONDS", "1.5")
    )

    DEFAULT_BASE_DOMAIN: str = os.getenv("BASE_URL", "http://demo.hivagold.com")
    DEFAULT_LOGIN_URL: str = os.getenv(
        "LOGIN_URL", "http://demo.hivagold.com/api/user/api/auth/login/"
    )
    DEFAULT_GET_CAPTCHA_INFO_URL: str = os.getenv(
        "GET_CAPTCHA_INFO_URL", "http://demo.hivagold.com/api/user/api/captcha-image/"
    )
    DEFAULT_GET_CAPTCHA_IMAGE_BASE_URL: str = os.getenv(
        "GET_CAPTCHA_IMAGE_BASE_URL", "http://demo.hivagold.com/api"
    )
    DEFAULT_VERIFY_CAPTCHA_URL: str = os.getenv(
        "VERIFY_CAPTCHA_URL", "http://demo.hivagold.com/api/user/api/captcha-verify/"
    )
    DEFAULT_COOKIES_VALIDATION_URL: str = os.getenv(
        "COOKIES_VALIDATION_URL",
        "http://demo.hivagold.com/api/profile/api/tether-rate/",
    )

    AUTH_WORKER_PORT: int = int(os.getenv("AUTH_WORKER_PORT", "8002"))
    AUTH_WORKER_HOST: str = os.getenv("AUTH_WORKER_HOST", "0.0.0.0")

    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    REDIS_DB: int = int(os.getenv("REDIS_DB", "0"))
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD", "")
    REDIS_TTL: int = int(os.getenv("REDIS_TTL", "432000"))  # 5 days in seconds

    ADD_DEFAULT_HEADERS: bool = (
        os.getenv("ADD_DEFAULT_HEADERS", "true").lower() == "true"
    )

    APP_NAME: str = os.getenv("APP_NAME", "BOT Auth Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")


def get_config() -> Config:
    return Config()
