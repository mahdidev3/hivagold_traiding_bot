import asyncio
from dataclasses import dataclass
import logging
from typing import Any, Dict, Optional

from .service import TradingWorkerService


@dataclass
class TradingJob:
    args: Dict[str, Any]
    future: asyncio.Future


class TradingQueueManager:
    def __init__(self, service: TradingWorkerService, logger: logging.Logger):
        self.queue: asyncio.Queue[TradingJob] = asyncio.Queue()
        self.worker_task: Optional[asyncio.Task] = None
        self.service = service
        self.logger = logger

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
            self.worker_task = None

    async def enqueue(self, args: Dict[str, Any]) -> Any:
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        await self.queue.put(TradingJob(args=args, future=future))
        self.logger.debug("Enqueued trading job queue_size=%s", self.queue.qsize())
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                self.logger.debug("Dequeued trading job queue_size=%s", self.queue.qsize())
                result = await self.service.process(job.args)
                if not job.future.done():
                    job.future.set_result(result)
            except Exception as exc:
                self.logger.exception("Queue worker failed while processing trading job")
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
