from dataclasses import dataclass
import os


@dataclass
class Config:
    CAPTCHA_WORKER_PORT: int = os.getenv("CAPTCHA_WORKER_PORT", 8000)
    CAPTCHA_WORKER_HOST: str = os.getenv("CAPTCHA_WORKER_HOST", "0.0.0.0")
    APP_NAME: str = os.getenv("APP_NAME", "Bot Captcha Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")


config = Config()


def get_config() -> Config:
    return config
