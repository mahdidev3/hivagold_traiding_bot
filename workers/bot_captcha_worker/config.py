from dataclasses import dataclass
import os


def _get_positive_int(name: str, default: int) -> int:
    raw = os.getenv(name, str(default))
    try:
        value = int(raw)
        return value if value > 0 else default
    except (TypeError, ValueError):
        return default


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Captcha Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    CAPTCHA_WORKER_HOST: str = os.getenv("CAPTCHA_WORKER_HOST", "0.0.0.0")
    CAPTCHA_WORKER_PORT: int = int(os.getenv("CAPTCHA_WORKER_PORT", "8001"))
    CAPTCHA_CODE_LENGTH: int = _get_positive_int("CAPTCHA_CODE_LENGTH", 6)
    CAPTCHA_SOLVER_MAX_RETRY: int = _get_positive_int("CAPTCHA_SOLVER_MAX_RETRY", 4)


config = Config()


def get_config() -> Config:
    return config
