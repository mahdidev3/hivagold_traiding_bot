import asyncio
from dataclasses import dataclass
import logging
from typing import Optional

from .service import CaptchaSolverService


@dataclass
class CaptchaJob:
    """
    A queued captcha solve request.

    Fields:
    - image_bytes: raw image bytes
    - future: async future used to return result back to the request handler
    """

    image_bytes: bytes
    future: asyncio.Future


class CaptchaQueueManager:
    """
    In-memory FIFO queue for captcha solving.

    Notes:
    - Requests are processed one-by-one in arrival order.
    - This is per-process memory only.
    - If you run multiple instances, each instance has its own queue.
    """

    def __init__(self, service: CaptchaSolverService, logger: logging.Logger):
        self.queue: asyncio.Queue[CaptchaJob] = asyncio.Queue()
        self.worker_task: Optional[asyncio.Task] = None
        self.service = service
        self.logger = logger

    async def start(self):
        if self.worker_task is None:
            self.logger.info("Starting captcha queue worker loop")
            self.worker_task = asyncio.create_task(self._worker_loop())

    async def stop(self):
        if self.worker_task:
            self.logger.info("Stopping captcha queue worker loop")
            self.worker_task.cancel()
            try:
                await self.worker_task
            except asyncio.CancelledError:
                pass

    async def enqueue(self, image_bytes: bytes) -> str:
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        job = CaptchaJob(image_bytes=image_bytes, future=future)
        await self.queue.put(job)
        self.logger.debug("Enqueued captcha job queue_size=%s", self.queue.qsize())
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                self.logger.debug(
                    "Dequeued captcha job image_bytes=%s queue_size=%s",
                    len(job.image_bytes),
                    self.queue.qsize(),
                )
                code = self.service.solve_from_bytes(job.image_bytes)
                if not job.future.done():
                    job.future.set_result(code)
            except Exception as exc:
                self.logger.exception("Captcha queue worker failed")
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
