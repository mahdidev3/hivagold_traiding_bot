import os
from dataclasses import dataclass
from urllib.parse import urljoin


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

    DEFAULT_BASE_DOMAIN: str = os.getenv("BASE_DOMAIN", "http://hivagold.com")

    LOGIN_PATH: str = os.getenv("LOGIN_PATH", "/api/user/api/auth/login/")
    CAPTCHA_INFO_PATH: str = os.getenv(
        "CAPTCHA_INFO_PATH", "/api/user/api/captcha-image/"
    )
    CAPTCHA_IMAGE_BASE_PATH: str = os.getenv("CAPTCHA_IMAGE_BASE_PATH", "/api")
    VERIFY_CAPTCHA_PATH: str = os.getenv(
        "VERIFY_CAPTCHA_PATH", "/api/user/api/captcha-verify/"
    )
    COOKIES_VALIDATION_PATH: str = os.getenv(
        "COOKIES_VALIDATION_PATH", "/api/profile/api/tether-rate/"
    )

    AUTH_WORKER_PORT: int = int(os.getenv("AUTH_WORKER_PORT", "8002"))
    AUTH_WORKER_HOST: str = os.getenv("AUTH_WORKER_HOST", "0.0.0.0")

    USERS_STORAGE_DIR: str = os.getenv("USERS_STORAGE_DIR", "./Users")
    SESSION_TTL_SECONDS: int = int(os.getenv("SESSION_TTL_SECONDS", "432000"))

    ADD_DEFAULT_HEADERS: bool = (
        os.getenv("ADD_DEFAULT_HEADERS", "true").lower() == "true"
    )

    APP_NAME: str = os.getenv("APP_NAME", "BOT Auth Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")


def get_config() -> Config:
    return Config()


def build_api_url(base_domain: str, path: str) -> str:
    base = (base_domain or "").rstrip("/") + "/"
    return urljoin(base, (path or "").lstrip("/"))
