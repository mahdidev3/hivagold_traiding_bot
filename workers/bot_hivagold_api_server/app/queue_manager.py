import asyncio
from dataclasses import dataclass
from typing import Optional, Dict, Any

from .service import ApiService


@dataclass
class ApiJob:
    """
    A queued API request.

    Fields:
    - args: request arguments as a dictionary
    - future: async future used to return result back to the request handler
    """

    args: Dict[str, Any]
    future: asyncio.Future


class ApiQueueManager:
    """
    In-memory FIFO queue for API requests.

    Notes:
    - Requests are processed one-by-one in arrival order.
    - This is per-process memory only.
    - If you run multiple instances, each instance has its own queue.
    """

    def __init__(self, service: ApiService):
        self.queue: asyncio.Queue[ApiJob] = asyncio.Queue()
        self.worker_task: Optional[asyncio.Task] = None
        self.service = service

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

    async def enqueue(self, args: Dict[str, Any]) -> Any:
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        job = ApiJob(args=args, future=future)
        await self.queue.put(job)
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                result = await self.service.process(job.args)
                if not job.future.done():
                    job.future.set_result(result)
            except Exception as exc:
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
