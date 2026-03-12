import asyncio
from dataclasses import dataclass
import logging
from typing import Optional

from .service import LoginWorkerService


@dataclass
class LoginJob:
    """
    A queued login request.

    Fields:
    - mobile: user mobile number
    - password: user password
    - future: async future used to return result back to request handler
    """

    mobile: str
    password: str
    max_retries: int
    future: asyncio.Future
    base_domain: Optional[str] = None
    login_url: Optional[str] = None
    get_captcha_info_url: Optional[str] = None
    get_captcha_image_base_url: Optional[str] = None
    verify_captcha_url: Optional[str] = None
    cookies_validation_url: Optional[str] = None


class LoginQueueManager:
    """
    In-memory FIFO queue for login requests.

    Notes:
    - Requests are processed sequentially.
    - This queue is in-memory and local to one process only.
    """

    def __init__(self, service: LoginWorkerService, logger: logging.Logger):
        self.queue: asyncio.Queue[LoginJob] = asyncio.Queue()
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

    async def enqueue(
        self,
        mobile: str,
        password: str,
        max_retries: int,
        base_domain: Optional[str] = None,
        login_url: Optional[str] = None,
        get_captcha_info_url: Optional[str] = None,
        get_captcha_image_base_url: Optional[str] = None,
        verify_captcha_url: Optional[str] = None,
        cookies_validation_url: Optional[str] = None,
    ) -> tuple[bool, Optional[dict]]:
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        job = LoginJob(
            mobile=mobile,
            password=password,
            max_retries=max_retries,
            base_domain=base_domain,
            login_url=login_url,
            get_captcha_info_url=get_captcha_info_url,
            get_captcha_image_base_url=get_captcha_image_base_url,
            verify_captcha_url=verify_captcha_url,
            cookies_validation_url=cookies_validation_url,
            future=future,
        )
        await self.queue.put(job)
        self.logger.debug(
            "Enqueued login job for mobile=%s queue_size=%s",
            mobile,
            self.queue.qsize(),
        )
        return await future

    async def _worker_loop(self):
        while True:
            job = await self.queue.get()
            try:
                self.logger.debug(
                    "Dequeued login job for mobile=%s queue_size=%s",
                    job.mobile,
                    self.queue.qsize(),
                )
                (success, cookies) = self.service.login(
                    mobile=job.mobile,
                    password=job.password,
                    max_retries=job.max_retries,
                    base_domain=job.base_domain,
                    login_url=job.login_url,
                    get_captcha_info_url=job.get_captcha_info_url,
                    get_captcha_image_base_url=job.get_captcha_image_base_url,
                    verify_captcha_url=job.verify_captcha_url,
                    cookies_validation_url=job.cookies_validation_url,
                )
                if not job.future.done():
                    job.future.set_result((success, cookies))
            except Exception as exc:
                self.logger.exception("Queue worker failed while processing login job")
                if not job.future.done():
                    job.future.set_exception(exc)
            finally:
                self.queue.task_done()
