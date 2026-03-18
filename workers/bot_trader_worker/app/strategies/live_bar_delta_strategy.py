from __future__ import annotations

import asyncio
import json
import time
from collections import deque
from pathlib import Path
from typing import Any, Optional

import aiohttp
from aiohttp import WSMsgType

from .strategy_base import StrategyBase


class LiveBarDeltaStrategy(StrategyBase):
    """
    Websocket-only candle builder.

    Reads live-bar messages like:
    {
        "message": "[candle] {\"M\": \"hivagold\", \"FSYM\": \"ounce\", \"TSYM\": \"gold\", \"TYPE\": \"0\", \"TS\": \"1773823461\", \"P\": \"4985.59\"}"
    }

    Builds OHLC candles from incoming ticks and prints the latest CLOSED candle.

    Example:
    - now = 09:20:22
    - resolution = 1 minute
    -> latest closed candle is 09:19:00 to 09:19:59

    Required metadata:
    {
      "phone_number": "09xxxxxxxxx",
      "domain": "https://hivagold.com",
      "live_bars_ws_url": "wss://....",
      "resolution": "1",
      "live_subscribe_message": {...}
    }
    """

    def __init__(self, config):
        super().__init__(config)
        self._session_stop = asyncio.Event()
        self._bars_lock = asyncio.Lock()

        # bucket_start_ts -> {"ts", "open", "high", "low", "close"}
        self._bars_by_ts: dict[int, dict[str, float]] = {}

        # raw incoming live-bar messages for last 10 minutes
        self._recent_ticks: deque[dict[str, float]] = deque()

        self._last_reported_closed_bar_ts: Optional[int] = None

    def run(self) -> None:
        asyncio.run(self._run_async())

    async def _run_async(self) -> None:
        metadata = self._validate_metadata(self.config.metadata)
        auth_payload = self._load_auth_payload(metadata["phone_number"])
        headers = self._build_headers(auth_payload, metadata["domain"])

        timeout = aiohttp.ClientTimeout(total=None, sock_connect=30, sock_read=None)
        connector = aiohttp.TCPConnector(ssl=False)

        self.log(
            "INFO",
            (
                "LiveBarDeltaStrategy started "
                f"resolution={metadata['resolution']} "
                f"resolution_seconds={metadata['resolution_seconds']} "
                f"keep_ticks_seconds={metadata['keep_ticks_seconds']}"
            ),
        )

        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers=headers,
        ) as session:
            tasks = [
                asyncio.create_task(
                    self._live_bars_ws_loop(session, metadata, headers),
                    name=f"{self.config.bot_id}-live-bars-ws-loop",
                ),
                asyncio.create_task(
                    self._decision_loop(metadata),
                    name=f"{self.config.bot_id}-decision-loop",
                ),
                asyncio.create_task(
                    self._wait_for_stop(),
                    name=f"{self.config.bot_id}-stop-waiter",
                ),
            ]

            done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)

            for task in done:
                try:
                    exc = task.exception()
                except asyncio.CancelledError:
                    exc = None
                if exc is not None:
                    self.log("ERROR", f"Task failed: {exc}")

            self._session_stop.set()

            for task in pending:
                task.cancel()

            await asyncio.gather(*pending, return_exceptions=True)
            await asyncio.gather(*done, return_exceptions=True)

        self.log("INFO", "LiveBarDeltaStrategy finished")

    async def _wait_for_stop(self) -> None:
        while not self._stop_event.is_set():
            await asyncio.sleep(0.2)

    def _validate_metadata(self, metadata: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(metadata, dict):
            raise ValueError("metadata must be an object")

        normalized: dict[str, Any] = {}

        phone_number = metadata.get("phone_number")
        domain = metadata.get("domain")
        live_bars_ws_url = metadata.get("live_bars_ws_url")

        if not phone_number:
            raise ValueError("metadata.phone_number is required")
        if not domain:
            raise ValueError("metadata.domain is required")
        if not live_bars_ws_url:
            raise ValueError("metadata.live_bars_ws_url is required")

        normalized["phone_number"] = str(phone_number)
        normalized["domain"] = str(domain).rstrip("/")
        normalized["live_bars_ws_url"] = str(live_bars_ws_url)

        normalized["symbol"] = str(metadata.get("symbol", "ounce"))
        normalized["resolution"] = str(metadata.get("resolution", "1"))
        normalized["decision_interval_seconds"] = float(
            metadata.get("decision_interval_seconds", 0.5)
        )
        normalized["live_subscribe_message"] = metadata.get("live_subscribe_message")
        normalized["live_ping_message"] = metadata.get("live_ping_message")
        normalized["live_ping_interval_seconds"] = int(
            metadata.get("live_ping_interval_seconds", 30)
        )

        # keep last 10 minutes of raw live-bar messages
        normalized["keep_ticks_seconds"] = int(metadata.get("keep_ticks_seconds", 600))
        normalized["resolution_seconds"] = self._resolution_to_seconds(
            normalized["resolution"]
        )

        return normalized

    @staticmethod
    def _resolution_to_seconds(resolution: str) -> int:
        value = str(resolution).strip().lower()

        mapping = {
            "1": 60,
            "3": 180,
            "5": 300,
            "15": 900,
            "30": 1800,
            "60": 3600,
            "1h": 3600,
            "4h": 14400,
            "1d": 86400,
            "d": 86400,
        }
        if value in mapping:
            return mapping[value]

        if value.endswith("m") and value[:-1].isdigit():
            return int(value[:-1]) * 60
        if value.endswith("h") and value[:-1].isdigit():
            return int(value[:-1]) * 3600

        raise ValueError(f"Unsupported resolution: {resolution}")

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
        self.log("INFO", f"Loaded auth session for domain: {domain}")

        if not session_data:
            raise ValueError(
                f"session data empty for domain '{domain}' in {user_info_path}"
            )

        return session_data

    def _build_headers(
        self, auth_payload: dict[str, Any], domain: str
    ) -> dict[str, str]:
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
        headers.setdefault("Origin", domain)
        headers.setdefault("Accept", "application/json")

        return headers

    async def _live_bars_ws_loop(
        self,
        session: aiohttp.ClientSession,
        metadata: dict[str, Any],
        headers: dict[str, str],
    ) -> None:
        ping_task: Optional[asyncio.Task] = None

        while not self._stop_event.is_set() and not self._session_stop.is_set():
            try:
                self.log("INFO", f"Connecting live-bars websocket: {metadata['live_bars_ws_url']}")

                async with session.ws_connect(
                    metadata["live_bars_ws_url"],
                    headers=headers,
                    heartbeat=30,
                ) as ws:
                    self.log("INFO", "Connected to live-bars websocket")

                    subscribe_message = metadata.get("live_subscribe_message")
                    if subscribe_message is not None:
                        await ws.send_json(subscribe_message)
                        self.log("INFO", f"Sent live-bars subscribe message: {subscribe_message}")

                    ping_message = metadata.get("live_ping_message")
                    if ping_message is not None:
                        ping_task = asyncio.create_task(
                            self._ws_ping_loop(
                                ws=ws,
                                ping_message=ping_message,
                                interval_seconds=metadata["live_ping_interval_seconds"],
                            )
                        )

                    async for message in ws:
                        if self._stop_event.is_set() or self._session_stop.is_set():
                            break

                        if message.type == WSMsgType.TEXT:
                            await self._handle_live_bars_message(
                                raw_message=message.data,
                                keep_ticks_seconds=metadata["keep_ticks_seconds"],
                                resolution_seconds=metadata["resolution_seconds"],
                            )
                            continue

                        if message.type == WSMsgType.BINARY:
                            self.log(
                                "WARNING",
                                f"live-bars websocket sent binary frame size={len(message.data)}",
                            )
                            continue

                        if message.type == WSMsgType.ERROR:
                            raise RuntimeError(f"live-bars websocket error: {ws.exception()}")

                        if message.type in {
                            WSMsgType.CLOSE,
                            WSMsgType.CLOSED,
                            WSMsgType.CLOSING,
                        }:
                            self.log("WARNING", f"live-bars websocket closed: {message.type.name}")
                            break

            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.log("ERROR", f"live-bars websocket failed: {exc}")
                await asyncio.sleep(3)
            finally:
                if ping_task is not None:
                    ping_task.cancel()
                    await asyncio.gather(ping_task, return_exceptions=True)
                    ping_task = None

    async def _ws_ping_loop(
        self,
        ws: aiohttp.ClientWebSocketResponse,
        ping_message: Any,
        interval_seconds: int,
    ) -> None:
        while True:
            await asyncio.sleep(interval_seconds)
            await ws.send_json(ping_message)

    async def _handle_live_bars_message(
        self,
        raw_message: str,
        keep_ticks_seconds: int,
        resolution_seconds: int,
    ) -> None:
        tick = self._extract_tick_from_ws_message(raw_message)
        if tick is None:
            return

        tick_ts = int(tick["ts"])
        tick_price = float(tick["price"])
        bucket_start = (tick_ts // resolution_seconds) * resolution_seconds

        async with self._bars_lock:
            # save raw incoming live-bar message
            self._recent_ticks.append(tick)

            # keep only last 10 minutes
            min_allowed_ts = int(time.time()) - keep_ticks_seconds
            while self._recent_ticks and int(self._recent_ticks[0]["ts"]) < min_allowed_ts:
                self._recent_ticks.popleft()

            # update / create OHLC candle
            existing = self._bars_by_ts.get(bucket_start)
            if existing is None:
                self._bars_by_ts[bucket_start] = {
                    "ts": float(bucket_start),
                    "open": tick_price,
                    "high": tick_price,
                    "low": tick_price,
                    "close": tick_price,
                }
            else:
                existing["high"] = max(float(existing["high"]), tick_price)
                existing["low"] = min(float(existing["low"]), tick_price)
                existing["close"] = tick_price

            # trim old candles too
            # keep a bit more than 10 min to safely cover boundary candles
            candle_keep_from = min_allowed_ts - (2 * resolution_seconds)
            old_keys = [ts for ts in self._bars_by_ts.keys() if ts < candle_keep_from]
            for ts in old_keys:
                self._bars_by_ts.pop(ts, None)

    def _extract_tick_from_ws_message(self, raw_message: str) -> Optional[dict[str, float]]:
        """
        Supports:
        1) {"message": "[candle] {...json...}"}
        2) {"message": "{...json...}"}
        3) direct json payload with TS/P
        """
        try:
            payload = json.loads(raw_message)
        except json.JSONDecodeError:
            self.log("WARNING", f"Invalid JSON from live-bars websocket: {raw_message[:300]}")
            return None

        candidate: Any = payload

        if isinstance(payload, dict) and "message" in payload:
            msg = payload["message"]

            if not isinstance(msg, str):
                return None

            msg = msg.strip()
            if msg.startswith("[candle]"):
                msg = msg[len("[candle]"):].strip()

            try:
                candidate = json.loads(msg)
            except json.JSONDecodeError:
                self.log("WARNING", f"Invalid candle JSON in message field: {msg[:300]}")
                return None

        if not isinstance(candidate, dict):
            return None

        ts_value = candidate.get("TS")
        price_value = candidate.get("P")

        if ts_value is None or price_value is None:
            return None

        try:
            return {
                "ts": float(int(ts_value)),
                "price": float(price_value),
            }
        except (TypeError, ValueError):
            return None

    async def _decision_loop(self, metadata: dict[str, Any]) -> None:
        resolution_seconds = metadata["resolution_seconds"]

        while not self._stop_event.is_set() and not self._session_stop.is_set():
            try:
                closed_bar = await self._latest_closed_bar(resolution_seconds)
                if closed_bar is not None:
                    await self._print_closed_bar(closed_bar, resolution_seconds)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.log("ERROR", f"Decision loop failed: {exc}")

            await asyncio.sleep(metadata["decision_interval_seconds"])

    async def _latest_closed_bar(
        self,
        resolution_seconds: int,
    ) -> Optional[dict[str, float]]:
        now_ts = int(time.time())

        # current forming candle bucket
        current_bucket_start = (now_ts // resolution_seconds) * resolution_seconds

        # latest closed candle bucket
        target_closed_bar_ts = current_bucket_start - resolution_seconds

        if target_closed_bar_ts < 0:
            return None

        async with self._bars_lock:
            bar = self._bars_by_ts.get(target_closed_bar_ts)
            if bar is None:
                return None
            return dict(bar)

    async def _print_closed_bar(
        self,
        bar: dict[str, float],
        resolution_seconds: int,
    ) -> None:
        bar_ts = int(bar["ts"])

        if self._last_reported_closed_bar_ts == bar_ts:
            return

        start_ts = bar_ts
        end_ts = bar_ts + resolution_seconds - 1
        now_ts = int(time.time())

        message = (
            f"latest_closed_candle "
            f"from={start_ts} "
            f"to={end_ts} "
            f"now={now_ts} "
            f"open={float(bar['open']):.2f} "
            f"high={float(bar['high']):.2f} "
            f"low={float(bar['low']):.2f} "
            f"close={float(bar['close']):.2f}"
        )

        print(message, flush=True)
        self.log("INFO", message)

        self._last_reported_closed_bar_ts = bar_ts