from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

import aiohttp
from aiohttp import WSMessage, WSMsgType

from .strategy_base import StrategyBase


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

        self.log(
            "INFO",
            (
                "WsMetadataStrategy started "
                f"phone_number={metadata['phone_number']} "
                f"streams={', '.join(name for name, _ in self.STREAM_KEYS)}"
            ),
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
                self.log("INFO", "Stop event received, closing websocket streams")
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

        self.log("INFO", "WsMetadataStrategy finished")

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

        # Get first domain dynamically
        domain, session_data = next(iter(sessions.items()))

        self.log("INFO", f"Loaded auth session for domain: {domain}")

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
        self.log("INFO", f"Connecting to {stream_name} websocket: {ws_url}")

        try:
            async with session.ws_connect(ws_url, headers=headers, heartbeat=30) as ws:
                self.log("INFO", f"Connected to {stream_name} websocket")

                async for message in ws:
                    if self._stop_event.is_set():
                        break

                    await self._handle_ws_message(stream_name, message)

        except asyncio.CancelledError:
            self.log("WARNING", f"{stream_name} websocket listener cancelled")
            raise
        except Exception as exc:
            self.log("ERROR", f"{stream_name} websocket failed: {exc}")
            raise
        finally:
            self.log("INFO", f"{stream_name} websocket listener stopped")

    async def _handle_ws_message(self, stream_name: str, message: WSMessage) -> None:
        if message.type == WSMsgType.TEXT:
            output = f"[{stream_name}] {message.data}"
            print(output, flush=True)
            self.log("INFO", output)
            return

        if message.type == WSMsgType.BINARY:
            output = f"[{stream_name}] <binary {len(message.data)} bytes>"
            print(output, flush=True)
            self.log("INFO", output)
            return

        if message.type == WSMsgType.ERROR:
            raise RuntimeError(f"[{stream_name}] websocket error: {message.data}")

        if message.type in {WSMsgType.CLOSE, WSMsgType.CLOSED, WSMsgType.CLOSING}:
            self.log("WARNING", f"[{stream_name}] websocket closed: {message.type.name}")
            return

        self.log("INFO", f"[{stream_name}] ignored websocket message type: {message.type}")