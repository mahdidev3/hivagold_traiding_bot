from dataclasses import dataclass
import logging
from typing import Any
from urllib.parse import urljoin

import requests

from config import Config


@dataclass
class WorkerHttpClient:
    base_url: str
    timeout: int
    logger: logging.Logger

    def post(self, path: str, body: dict[str, Any]) -> dict[str, Any]:
        self.logger.debug("POST worker request path=%s", path)
        response = requests.post(f"{self.base_url.rstrip('/')}{path}", json=body, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get(self, path: str) -> dict[str, Any]:
        self.logger.debug("GET worker request path=%s", path)
        response = requests.get(f"{self.base_url.rstrip('/')}{path}", timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get_absolute(self, url: str) -> dict[str, Any]:
        response = requests.get(url, timeout=self.timeout)
        response.raise_for_status()
        return response.json()


def build_market_status_url(base_domain: str, market: str) -> str:
    normalized_base = base_domain.rstrip("/") + "/"
    return urljoin(normalized_base, f"{market}/api/status/")


def build_clients(config: Config, logger: logging.Logger) -> tuple[WorkerHttpClient, WorkerHttpClient, WorkerHttpClient]:
    timeout = max(1, int(config.HTTP_TIMEOUT_SECONDS))
    return (
        WorkerHttpClient(config.AUTH_WORKER_URL, timeout, logger),
        WorkerHttpClient(config.ROOM_WORKER_URL, timeout, logger),
        WorkerHttpClient(config.TRADING_WORKER_URL, timeout, logger),
    )
