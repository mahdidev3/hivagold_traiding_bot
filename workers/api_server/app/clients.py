from dataclasses import dataclass
import logging
from typing import Any

import requests

from config import Config


@dataclass
class WorkerHttpClient:
    base_url: str
    timeout: int
    logger: logging.Logger

    def post(self, path: str, body: dict[str, Any]) -> dict[str, Any]:
        self.logger.debug("POST worker request path=%s", path)
        response = requests.post(
            f"{self.base_url.rstrip('/')}{path}",
            json=body,
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()

    def get(self, path: str) -> dict[str, Any]:
        self.logger.debug("GET worker request path=%s", path)
        response = requests.get(
            f"{self.base_url.rstrip('/')}{path}",
            timeout=self.timeout,
        )
        response.raise_for_status()
        return response.json()


def build_clients(config: Config, logger: logging.Logger) -> tuple[WorkerHttpClient, WorkerHttpClient]:
    timeout = max(1, int(config.HTTP_TIMEOUT_SECONDS))
    return (
        WorkerHttpClient(config.AUTH_WORKER_URL, timeout, logger),
        WorkerHttpClient(config.TRADING_WORKER_URL, timeout, logger),
    )
