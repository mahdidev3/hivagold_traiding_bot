import os
from dataclasses import dataclass


@dataclass
class Config:
    # Application Configuration
    APP_NAME: str = os.getenv("APP_NAME", "Bot Room Worker")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    HIVAGOLD_TENANT_ID: str = os.getenv("HIVAGOLD_TENANT_ID", "11111")

    # Room Worker Server Configuration
    ROOM_WORKER_HOST: str = os.getenv("ROOM_WORKER_HOST", "0.0.0.0")
    ROOM_WORKER_PORT: int = int(os.getenv("ROOM_WORKER_PORT", "8005"))

    # Session cache configuration
    SESSION_CACHE_FILE: str = os.getenv("SESSION_CACHE_FILE", "data/room_sessions.json")

    # Hivagold Configuration
    BASE_DOMAIN: str = os.getenv("BASE_DOMAIN", "http://hivagold.com")
    ROOM_PREFIX: str = os.getenv("ROOM_PREFIX", "/xag")
    ADD_DEFAULT_HEADERS: bool = (
        os.getenv("ADD_DEFAULT_HEADERS", "true").lower() == "true"
    )

    # Session cache TTL Configuration
    SESSION_CACHE_TTL: int = int(
        os.getenv("SESSION_CACHE_TTL", str(14 * 24 * 60 * 60))
    )  # 14 days


config = Config()


def get_config() -> Config:
    return config
