from logging import Logger

from fastapi import FastAPI, HTTPException

from .clients import build_clients
from .logging_setup import setup_logger
from .schemas import (
    HealthResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
)
from .service import LoginWorkerService
from config import build_api_url, get_config

config = get_config()
logger: Logger = setup_logger(config)

api_client, captcha_worker_client, redis_client = build_clients(config, logger)
service = LoginWorkerService(
    api_client, captcha_worker_client, redis_client, config, logger
)
app = FastAPI(title=config.APP_NAME, version=config.APP_VERSION)


# ------------------------------------------------------------------
# Endpoint: GET /health
#
# Purpose:
# - Check whether this worker process is alive.
#
# Response:
#   - status: "healthy" or "unhealthy"
#   - app_name: Name of the application
#   - version: Version of the application
# ------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse)
async def health():
    """
    Health check endpoint.

    Returns:
        HealthResponse: Status, app name, and version
    """
    return HealthResponse(
        status="healthy",
        app_name=config.APP_NAME,
        version=config.APP_VERSION,
    )


# ------------------------------------------------------------------
# Endpoint: POST /login
#
# Purpose:
# - Accept login request
# - Push request into internal queue
# - Perform login flow sequentially
# - Return final success state
#
# Request body:
# {
#   "mobile": "09123456789",
#   "password": "your-password"
# }
#
# Example:
# curl -X POST "http://auth-worker-service/login" \
#     -H "Content-Type: application/json" \
#     -d '{"mobile": "09123456789", "password": "your-password", "max_retries": 3 , base_domain: "https://demo.hivagold.com" , login_url: "https://demo.hivagold.com/api/user/api/auth/login/" , get_captcha_info_url: "https://demo.hivagold.com/api/user/api/captcha-image/" , get_captcha_image_base_url: "https://demo.hivagold.com/api" , verify_captcha_url: "https://demo.hivagold.com/api/user/api/captcha-verify/" , cookies_validation_url: "https://demo.hivagold.com/api/profile/api/tether-rate/"}'
#
# Response:
# - {"success": true , "cookies": {"csrftoken": "abc123", "sessionid": "def456"}}
# ------------------------------------------------------------------
@app.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    try:
        logger.debug("Received login request for mobile=%s", payload.mobile)
        base_domain = payload.base_domain or config.DEFAULT_BASE_DOMAIN
        (success, cookies) = service.login(
            payload.mobile,
            payload.password,
            payload.max_retries,
            base_domain,
            build_api_url(base_domain, config.LOGIN_PATH),
            build_api_url(base_domain, config.CAPTCHA_INFO_PATH),
            build_api_url(base_domain, config.CAPTCHA_IMAGE_BASE_PATH),
            build_api_url(base_domain, config.VERIFY_CAPTCHA_PATH),
            build_api_url(base_domain, config.COOKIES_VALIDATION_PATH),
        )
        logger.info("Login request finished success=%s for mobile=%s", success, payload.mobile)
        return LoginResponse(success=success)
    except Exception as exc:
        logger.exception("Unhandled error while processing login request")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/logout", response_model=LogoutResponse)
async def logout(payload: LogoutRequest):
    try:
        logger.debug("Received logout request for mobile=%s", payload.mobile)
        success = service.logout(
            payload.mobile, payload.base_domain or config.DEFAULT_BASE_DOMAIN
        )
        return LogoutResponse(success=success)
    except Exception as exc:
        logger.exception("Unhandled error while processing logout request")
        raise HTTPException(status_code=500, detail=str(exc))
