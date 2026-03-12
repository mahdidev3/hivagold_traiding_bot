from dataclasses import dataclass
import os


@dataclass
class Config:
    APP_NAME: str = os.getenv("APP_NAME", "Bot Hivagold API Server")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    HIVAGOLD_TENANT_ID: str = os.getenv("HIVAGOLD_TENANT_ID", "11111")

    HIVAGOLD_API_SERVER_HOST: str = os.getenv("HIVAGOLD_API_SERVER_HOST", "0.0.0.0")
    HIVAGOLD_API_SERVER_PORT: int = int(os.getenv("HIVAGOLD_API_SERVER_PORT", "8000"))
    
    # Bot Auth Worker Configuration
    HIVAGOLD_BOT_AUTH_URL: str = os.getenv(
        "HIVAGOLD_BOT_AUTH_URL", "http://localhost:8001"
    )
    
    # Redis Configuration
    HIVAGOLD_REDIS_HOST: str = os.getenv("HIVAGOLD_REDIS_HOST", "localhost")
    HIVAGOLD_REDIS_PORT: int = int(os.getenv("HIVAGOLD_REDIS_PORT", "6379"))
    HIVAGOLD_REDIS_DB: int = int(os.getenv("HIVAGOLD_REDIS_DB", "0"))
    HIVAGOLD_REDIS_PASSWORD: str = os.getenv("HIVAGOLD_REDIS_PASSWORD", "")
    
    # MongoDB Configuration
    Tenants_MONGODB_DSN: str = os.getenv("Tenants_MONGODB_DSN", "mongodb://localhost:27017")
    Tenants_MONGODB_DATABASE: str = os.getenv("Tenants_MONGODB_DATABASE", "hivagold_tenants")
    Tenants_MONGODB_COLLECTION: str = os.getenv("Tenants_MONGODB_COLLECTION", "users")
    
    # Security Configuration
    PUBLIC_KEY_PEM: str = os.getenv("PUBLIC_KEY_PEM", "")


config = Config()


def get_config() -> Config:
    return config
