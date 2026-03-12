from contextlib import asynccontextmanager
from logging import Logger

import requests

from fastapi import FastAPI, HTTPException
from .logging_setup import setup_logger
from .service import (
    CaptchaSolverService,
)

from .queue_manager import CaptchaQueueManager
from .schemas import HealthResponse, SolveRequest, SolveResponse
from config import get_config

config = get_config()
logger: Logger = setup_logger(config)
captcha_solver_service = CaptchaSolverService(
    logger=logger,
    code_length=config.CAPTCHA_CODE_LENGTH,
    max_retry=config.CAPTCHA_SOLVER_MAX_RETRY,
)
queue_manager = CaptchaQueueManager(captcha_solver_service, logger)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting captcha queue manager")
    await queue_manager.start()
    yield
    logger.info("Stopping captcha queue manager")
    await queue_manager.stop()


app = FastAPI(
    title=config.APP_NAME,
    version=config.APP_VERSION,
    lifespan=lifespan,
)


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
# Endpoint: POST /solve
#
# Purpose:
# - Accept a captcha image as multipart/form-data
# - Push the request into the internal queue
# - Wait for processing result
# - Return the solved captcha code
#
# Request:
# - multipart/form-data
# - field name: file
#
# Example:
# curl -X POST "http://localhost:8080/solve"
#
# Response:
# - {"code": "123456"}
# ------------------------------------------------------------------
@app.post("/solve", response_model=SolveResponse)
async def solve(payload: SolveRequest):
    try:
        logger.debug("Received solve request image_url=%s", payload.image_url)
        r = requests.get(payload.image_url, timeout=30)
        r.raise_for_status()
        content_type = (r.headers.get("Content-Type") or "").lower()
        if content_type and not content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail=f"URL did not return an image. Content-Type={content_type}",
            )
        image_bytes = r.content
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Empty file")

        code = await queue_manager.enqueue(image_bytes)
        logger.info("Solve request finished code_length=%s", len(code))
        return SolveResponse(code=code)
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Unhandled error while solving captcha")
        raise HTTPException(status_code=500, detail=str(exc))
