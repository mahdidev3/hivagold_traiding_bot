import asyncio
from dataclasses import dataclass
import logging
from typing import Any, Dict, Optional

from .service import PortfolioWorkerService


@dataclass
class PortfolioJob:
    args: Dict[str, Any]
    future: asyncio.Future


class PortfolioQueueManager:
    def __init__(self, service: PortfolioWorkerService, logger: logging.Logger):
        self.queue: asyncio.Queue[PortfolioJob] = asyncio.Queue()
        self.worker_task: Optional[asyncio.Task] = None
        self.service = service
        self.logger = logger

    async def start(self):
        if self.worker_task is None:
            self.worker_task = asyncio.create_task(self._worker_loop())

    async def stop(self):
        if self.worker_task:
            self.worker_task.cancel()
            try:
                await self.worker_task
            except asyncio.CancelledError:
                pass
            self.worker_task = None

    async def enqueue(self, args: Dict[str, Any]) -> Any:
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        await self.queue.put(PortfolioJob(args=args, future=future))
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                result = await self.service.process(job.args)
                if not job.future.done():
                    job.future.set_result(result)
            except Exception as exc:
                self.logger.exception("portfolio queue worker failed")
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
