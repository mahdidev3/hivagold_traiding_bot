import asyncio
from dataclasses import dataclass
import logging
from typing import Any, Optional, Protocol


class ApiServiceProtocol(Protocol):
    def execute(self, action: str, payload: dict[str, Any]) -> dict[str, Any]: ...


@dataclass
class ApiJob:
    action: str
    payload: dict[str, Any]
    future: asyncio.Future


class ApiQueueManager:
    def __init__(self, service: ApiServiceProtocol, logger: logging.Logger):
        self.queue: asyncio.Queue[ApiJob] = asyncio.Queue()
        self.service = service
        self.logger = logger
        self.worker_task: Optional[asyncio.Task] = None

    async def start(self):
        if self.worker_task is None:
            self.logger.info("Starting queue worker loop")
            self.worker_task = asyncio.create_task(self._worker_loop())

    async def stop(self):
        if self.worker_task:
            self.logger.info("Stopping queue worker loop")
            self.worker_task.cancel()
            try:
                await self.worker_task
            except asyncio.CancelledError:
                pass

    async def enqueue(self, action: str, payload: dict[str, Any]):
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        await self.queue.put(ApiJob(action=action, payload=payload, future=future))
        self.logger.debug("Enqueued api job action=%s queue_size=%s", action, self.queue.qsize())
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                self.logger.debug("Dequeued api job action=%s queue_size=%s", job.action, self.queue.qsize())
                result = self.service.execute(job.action, job.payload)
                if not job.future.done():
                    job.future.set_result(result)
            except Exception as exc:
                self.logger.exception("Queue worker failed while processing api job action=%s", job.action)
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
