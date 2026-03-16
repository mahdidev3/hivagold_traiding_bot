# from __future__ import annotations

# import asyncio
# import logging
# from datetime import datetime, timezone
# from typing import Any
# from uuid import uuid4

# from config import Config
# from .strategies.strategy_base import StrategyBase, BotConfig
# from .strategies.resolver import resolve_strategy


# class TraderWorkerService:
#     """In-memory placeholder service for the trader worker."""

#     def __init__(self, config: Config, logger: logging.Logger):
#         self.config = config
#         self.logger = logger
#         self._lock = asyncio.Lock()
#         self._bots: dict[str, dict[str, Any]] = {}
#         self._logs: dict[str, list[dict[str, Any]]] = {}

#     async def start(self) -> None:
#         self.logger.info("Trader worker service started")

#     async def stop(self) -> None:
#         bot_ids = list(self._bots.keys())
#         for bot_id in bot_ids:
#             try:
#                 await self.stop_bot(bot_id, reason="service_shutdown")
#             except Exception as exc:
#                 self.logger.warning(
#                     "Failed to stop bot %s during shutdown: %s", bot_id, exc
#                 )

#         self.logger.info("Trader worker service stopped")

#     @staticmethod
#     def _now() -> datetime:
#         return datetime.now(timezone.utc)

#     def _append_log(self, bot_id: str, level: str, message: str) -> None:
#         self._logs.setdefault(bot_id, []).append(
#             {
#                 "timestamp": self._now(),
#                 "level": level,
#                 "message": message,
#             }
#         )

#     def _build_bot_config(self, bot: dict[str, Any]) -> BotConfig:
#         return BotConfig(
#             bot_id=bot["bot_id"],
#             portfolio_id=bot["portfolio_id"],
#             run_mode=bot["mode"],
#             metadata=bot.get("metadata", {}),
#         )

#     def _build_strategy(self, bot: dict[str, Any]) -> StrategyBase:
#         strategy_cls = resolve_strategy(bot["strategy_name"])
#         return strategy_cls(bot["bot_config"])

#     def _public_bot(self, bot: dict[str, Any]) -> dict[str, Any]:
#         return {
#             key: value
#             for key, value in bot.items()
#             if key not in {"_strategy", "_task"}
#         }

#     async def create_bot(self, payload: dict[str, Any]) -> dict[str, Any]:
#         async with self._lock:
#             bot_id = f"bot-{uuid4().hex[:12]}"
#             now = self._now()

#             bot = {
#                 "bot_id": bot_id,
#                 "bot_name": payload["bot_name"],
#                 "strategy_name": payload["strategy_name"],
#                 "market": payload["market"],
#                 "portfolio_id": payload["portfolio_id"],
#                 "mode": payload["mode"],
#                 "description": payload.get("description"),
#                 "metadata": payload.get("metadata", {}),
#                 "status": "created",
#                 "created_at": now,
#                 "updated_at": now,
#             }

#             bot["bot_config"] = self._build_bot_config(bot)
#             bot["_strategy"] = self._build_strategy(bot)
#             bot["_task"] = None

#             self._bots[bot_id] = bot
#             self._append_log(
#                 bot_id,
#                 "INFO",
#                 f"Bot created with strategy={bot['strategy_name']}",
#             )

#             return {
#                 "bot": self._public_bot(bot),
#                 "message": "Bot created successfully.",
#                 "placeholder": True,
#             }

#     async def remove_bot(
#         self, bot_id: str, reason: str | None = None
#     ) -> dict[str, Any]:
#         bot = self._bots.get(bot_id)
#         if not bot:
#             raise ValueError("bot not found")

#         if bot["status"] == "running":
#             await self.stop_bot(bot_id, reason="remove_bot")

#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")

#             bot["status"] = "removed"
#             bot["updated_at"] = self._now()

#             self._append_log(
#                 bot_id, "WARNING", f"Bot removed. reason={reason or 'not_provided'}"
#             )

#             return {
#                 "bot_id": bot_id,
#                 "status": bot["status"],
#                 "message": "Bot removed successfully.",
#                 "updated_at": bot["updated_at"],
#                 "placeholder": True,
#             }

#     async def _run_strategy_task(self, bot_id: str, strategy: StrategyBase) -> None:
#         try:
#             await strategy.start()
#         except asyncio.CancelledError:
#             self._append_log(bot_id, "WARNING", "Strategy task cancelled")
#             raise
#         except Exception as exc:
#             self._append_log(bot_id, "ERROR", f"Strategy task crashed: {exc}")
#             async with self._lock:
#                 bot = self._bots.get(bot_id)
#                 if bot and bot["status"] != "removed":
#                     bot["status"] = "error"
#                     bot["updated_at"] = self._now()
#         finally:
#             async with self._lock:
#                 bot = self._bots.get(bot_id)
#                 if bot is not None:
#                     bot["_task"] = None
#                     if bot["status"] == "running":
#                         bot["status"] = "stopped"
#                         bot["updated_at"] = self._now()

#     async def start_bot(self, bot_id: str, reason: str | None = None) -> dict[str, Any]:
#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")
#             if bot["status"] == "removed":
#                 raise ValueError("removed bot can not be started")
#             if bot["status"] == "running":
#                 raise ValueError("bot is already running")

#             strategy: StrategyBase = bot["_strategy"]
#             task: asyncio.Task | None = bot["_task"]

#             if task is not None and not task.done():
#                 raise ValueError("bot task is already active")

#             bot["status"] = "running"
#             bot["updated_at"] = self._now()

#             bot["_task"] = asyncio.create_task(
#                 self._run_strategy_task(bot_id, strategy),
#                 name=f"strategy-{bot_id}",
#             )

#             self._append_log(
#                 bot_id, "INFO", f"Bot started. reason={reason or 'not_provided'}"
#             )

#             return {
#                 "bot_id": bot_id,
#                 "status": bot["status"],
#                 "message": "Bot started successfully.",
#                 "updated_at": bot["updated_at"],
#                 "placeholder": True,
#             }

#     async def stop_bot(self, bot_id: str, reason: str | None = None) -> dict[str, Any]:
#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")
#             if bot["status"] == "removed":
#                 raise ValueError("removed bot can not be stopped")
#             if bot["status"] != "running":
#                 raise ValueError("bot is not running")

#             strategy: StrategyBase = bot["_strategy"]
#             task: asyncio.Task | None = bot["_task"]

#             self._append_log(
#                 bot_id, "INFO", f"Bot stop requested. reason={reason or 'not_provided'}"
#             )

#         await strategy.stop()

#         if task is not None:
#             try:
#                 await task
#             except asyncio.CancelledError:
#                 pass

#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")

#             if bot["status"] != "removed":
#                 bot["status"] = "stopped"
#                 bot["updated_at"] = self._now()

#             return {
#                 "bot_id": bot_id,
#                 "status": bot["status"],
#                 "message": "Bot stopped successfully.",
#                 "updated_at": bot["updated_at"],
#                 "placeholder": True,
#             }

#     async def list_bots(self) -> dict[str, Any]:
#         async with self._lock:
#             bots = sorted(self._bots.values(), key=lambda item: item["created_at"])
#             return {
#                 "items": [self._public_bot(bot) for bot in bots],
#                 "count": len(bots),
#                 "placeholder": True,
#             }

#     async def get_bot_logs(self, bot_id: str, limit: int) -> dict[str, Any]:
#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")

#             strategy: StrategyBase = bot["_strategy"]
#             logs = strategy.get_logs()[-limit:]

#             return {
#                 "bot_id": bot_id,
#                 "source": "strategy",
#                 "items": logs,
#                 "count": len(logs),
#                 "placeholder": True,
#             }

#     async def get_all_logs(self, limit: int) -> dict[str, Any]:
#         async with self._lock:
#             items: list[dict[str, Any]] = []

#             for bot_id, bot_logs in self._logs.items():
#                 for entry in bot_logs[-limit:]:
#                     items.append(
#                         {
#                             "bot_id": bot_id,
#                             **entry,
#                         }
#                     )

#             items.sort(key=lambda item: item["timestamp"])
#             items = items[-limit:]

#             return {
#                 "source": "service",
#                 "items": items,
#                 "count": len(items),
#                 "placeholder": True,
#             }

#     async def get_status(self, bot_id: str) -> dict[str, Any]:
#         async with self._lock:
#             bot = self._bots.get(bot_id)
#             if not bot:
#                 raise ValueError("bot not found")

#             strategy: StrategyBase = bot["_strategy"]
#             task: asyncio.Task | None = bot["_task"]

#             return {
#                 "bot_id": bot_id,
#                 "status": bot["status"],
#                 "strategy_running": strategy.is_running,
#                 "task_active": task is not None and not task.done(),
#                 "message": "Bot status retrieved successfully.",
#                 "updated_at": bot["updated_at"],
#                 "placeholder": True,
#             }
from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

import aiohttp
from aiohttp import WSMessage, WSMsgType

from .strategies.strategy_base import StrategyBase


class WsMetadataStrategy(StrategyBase):
    """Simple strategy that opens websocket streams from metadata and prints data."""

    STREAM_KEYS: tuple[tuple[str, str], ...] = (
        ("price", "price_ws_url"),
        ("candle", "candle_ws_url"),
        ("wall", "wall_ws_url"),
    )

    async def run(self) -> None:
        metadata = self._validate_metadata(self.config.metadata)
        auth_payload = self._load_auth_payload(metadata["phone_number"])
        headers = self._build_ws_headers(auth_payload)

        print(
            "[INFO] WsMetadataStrategy started "
            f"phone_number={metadata['phone_number']} "
            f"streams={', '.join(name for name, _ in self.STREAM_KEYS)}",
            flush=True,
        )

        timeout = aiohttp.ClientTimeout(total=None, sock_connect=30, sock_read=None)
        connector = aiohttp.TCPConnector(ssl=False)

        async with aiohttp.ClientSession(timeout=timeout, connector=connector) as session:
            tasks = [
                asyncio.create_task(
                    self._consume_stream(
                        session=session,
                        stream_name=stream_name,
                        ws_url=metadata[metadata_key],
                        headers=headers,
                    ),
                    name=f"{self.config.bot_id}-{stream_name}-stream",
                )
                for stream_name, metadata_key in self.STREAM_KEYS
            ]

            stop_waiter = asyncio.create_task(
                self._stop_event.wait(),
                name=f"{self.config.bot_id}-stop-waiter",
            )

            done, pending = await asyncio.wait(
                [*tasks, stop_waiter],
                return_when=asyncio.FIRST_COMPLETED,
            )

            if stop_waiter in done:
                print("[INFO] Stop event received, closing websocket streams", flush=True)
            else:
                for completed_task in done:
                    if completed_task is stop_waiter:
                        continue
                    exc = completed_task.exception()
                    if exc is not None:
                        raise exc

            for pending_task in pending:
                pending_task.cancel()

            await asyncio.gather(*pending, return_exceptions=True)
            await asyncio.gather(*done, return_exceptions=True)

        print("[INFO] WsMetadataStrategy finished", flush=True)

    def _validate_metadata(self, metadata: dict[str, Any]) -> dict[str, str]:
        normalized: dict[str, str] = {}

        phone_number = self._pick_value(
            metadata,
            "phone_number",
            "phone",
            "user_phone",
        )
        if not phone_number:
            raise ValueError("metadata.phone_number is required")
        normalized["phone_number"] = str(phone_number)

        for target_key, *aliases in (
            ("price_ws_url", "price_ws_url", "price_websocket", "price_websocket_url", "websocket_price", "price_ws"),
            ("candle_ws_url", "candle_ws_url", "candle_websocket", "candle_websocket_url", "websocket_candle", "candle_ws"),
            ("wall_ws_url", "wall_ws_url", "wall_websocket", "wall_websocket_url", "websocket_wall", "wall_ws"),
        ):
            value = self._pick_value(metadata, *aliases)
            if not value:
                raise ValueError(f"metadata.{target_key} is required")
            normalized[target_key] = str(value)

        return normalized

    @staticmethod
    def _pick_value(metadata: dict[str, Any], *keys: str) -> Any:
        for key in keys:
            value = metadata.get(key)
            if value:
                return value
        return None

    def _get_project_root(self) -> Path:
        return Path(__file__).resolve().parents[3]

    def _get_user_info_path(self, phone_number: str) -> Path:
        return (
            self._get_project_root()
            / "bot_auth_worker"
            / "Users"
            / phone_number
            / "User_info.json"
        )

    def _load_auth_payload(self, phone_number: str) -> dict[str, Any]:
        user_info_path = self._get_user_info_path(phone_number)

        if not user_info_path.exists():
            raise FileNotFoundError(f"user info json not found: {user_info_path}")

        with user_info_path.open("r", encoding="utf-8") as file:
            payload = json.load(file)

        sessions = payload.get("sessions")
        if not sessions:
            raise ValueError(f"'sessions' not found in {user_info_path}")

        domain, session_data = next(iter(sessions.items()))

        print(f"[INFO] Loaded auth session for domain: {domain}", flush=True)

        if not session_data:
            raise ValueError(f"session data empty for domain '{domain}' in {user_info_path}")

        return session_data

    def _build_ws_headers(self, auth_payload: dict[str, Any]) -> dict[str, str]:
        raw_headers = auth_payload.get("headers") or {}
        cookies = auth_payload.get("cookies") or {}

        if not raw_headers:
            raise ValueError("headers not found in user auth json")
        if not cookies:
            raise ValueError("cookies not found in user auth json")

        blocked_headers = {
            "connection",
            "host",
            "upgrade",
            "sec-websocket-key",
            "sec-websocket-version",
            "sec-websocket-extensions",
            "cookie",
            "content-length",
        }

        headers = {
            key: str(value)
            for key, value in raw_headers.items()
            if value is not None and key.lower() not in blocked_headers
        }

        headers["Cookie"] = "; ".join(
            f"{cookie_name}={cookie_value}"
            for cookie_name, cookie_value in cookies.items()
        )

        return headers

    async def _consume_stream(
        self,
        session: aiohttp.ClientSession,
        stream_name: str,
        ws_url: str,
        headers: dict[str, str],
    ) -> None:

        print(f"[INFO] Connecting to {stream_name} websocket: {ws_url}", flush=True)

        try:
            async with session.ws_connect(ws_url, headers=headers, heartbeat=30) as ws:

                print(f"[INFO] Connected to {stream_name} websocket", flush=True)

                async for message in ws:
                    if self._stop_event.is_set():
                        break

                    await self._handle_ws_message(stream_name, message)

        except asyncio.CancelledError:
            print(f"[WARNING] {stream_name} websocket listener cancelled", flush=True)
            raise
        except Exception as exc:
            print(f"[ERROR] {stream_name} websocket failed: {exc}", flush=True)
            raise
        finally:
            print(f"[INFO] {stream_name} websocket listener stopped", flush=True)

    async def _handle_ws_message(self, stream_name: str, message: WSMessage) -> None:

        if message.type == WSMsgType.TEXT:
            print(f"[{stream_name}] {message.data}", flush=True)
            return

        if message.type == WSMsgType.BINARY:
            print(f"[{stream_name}] <binary {len(message.data)} bytes>", flush=True)
            return

        if message.type == WSMsgType.ERROR:
            raise RuntimeError(f"[{stream_name}] websocket error: {message.data}")

        if message.type in {WSMsgType.CLOSE, WSMsgType.CLOSED, WSMsgType.CLOSING}:
            print(f"[WARNING] [{stream_name}] websocket closed: {message.type.name}", flush=True)
            return

        print(f"[INFO] [{stream_name}] ignored websocket message type: {message.type}", flush=True)