from dataclasses import dataclass
from typing import Any

import requests

from config import Config


@dataclass
class WorkerHttpClient:
    base_url: str
    timeout: int

    def post(self, path: str, body: dict[str, Any]) -> dict[str, Any]:
        response = requests.post(f"{self.base_url.rstrip('/')}{path}", json=body, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def get(self, path: str) -> dict[str, Any]:
        response = requests.get(f"{self.base_url.rstrip('/')}{path}", timeout=self.timeout)
        response.raise_for_status()
        return response.json()


def build_clients(config: Config) -> tuple[WorkerHttpClient, WorkerHttpClient, WorkerHttpClient]:
    timeout = max(1, int(config.HTTP_TIMEOUT_SECONDS))
    return (
        WorkerHttpClient(config.AUTH_WORKER_URL, timeout),
        WorkerHttpClient(config.ROOM_WORKER_URL, timeout),
        WorkerHttpClient(config.TRADING_WORKER_URL, timeout),
    )
