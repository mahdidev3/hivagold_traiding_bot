import asyncio
from dataclasses import dataclass
from typing import Any, Optional


@dataclass
class ApiJob:
    action: str
    payload: dict[str, Any]
    future: asyncio.Future


class ApiQueueManager:
    def __init__(self, service):
        self.queue: asyncio.Queue[ApiJob] = asyncio.Queue()
        self.service = service
        self.worker_task: Optional[asyncio.Task] = None

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

    async def enqueue(self, action: str, payload: dict[str, Any]):
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        await self.queue.put(ApiJob(action=action, payload=payload, future=future))
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                result = self.service.execute(job.action, job.payload)
                if not job.future.done():
                    job.future.set_result(result)
            except Exception as exc:
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
