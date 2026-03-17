from __future__ import annotations

import asyncio
import json
import time
from pathlib import Path
from typing import Any, Optional

import aiohttp
from aiohttp import WSMsgType

from .strategy_base import StrategyBase


class LiveBarDeltaStrategy(StrategyBase):
    """
    Uses:
    - HTTP polling for historical/recent bars
    - live-bars websocket for realtime updates

    Rule:
    - find latest CLOSED bar
    - compute: close - open
    - if > threshold_usd, print/log that bar

    Required metadata:
    {
      "phone_number": "09xxxxxxxxx",
      "domain": "https://hivagold.com",
      "bars_http_url": "https://hivagold.com/ounce/api/ounce-bars/",
      "live_bars_ws_url": "wss://hivagold.com/.....",
      "symbol": "ounce",
      "resolution": "5",
      "live_subscribe_message": {...}
    }
    """

    def __init__(self, config):
        super().__init__(config)
        self._bars_by_ts: dict[int, dict[str, float]] = {}
        self._bars_lock = asyncio.Lock()
        self._session_stop = asyncio.Event()
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
                f"symbol={metadata['symbol']} "
                f"resolution={metadata['resolution']} "
                f"threshold_usd={metadata['threshold_usd']}"
            ),
        )

        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers=headers,
        ) as session:
            tasks = [
                asyncio.create_task(
                    self._bars_poll_loop(session, metadata),
                    name=f"{self.config.bot_id}-bars-poll-loop",
                ),
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
        bars_http_url = metadata.get("bars_http_url")
        live_bars_ws_url = metadata.get("live_bars_ws_url")

        if not phone_number:
            raise ValueError("metadata.phone_number is required")
        if not domain:
            raise ValueError("metadata.domain is required")
        if not bars_http_url:
            raise ValueError("metadata.bars_http_url is required")
        if not live_bars_ws_url:
            raise ValueError("metadata.live_bars_ws_url is required")

        normalized["phone_number"] = str(phone_number)
        normalized["domain"] = str(domain).rstrip("/")
        normalized["bars_http_url"] = str(bars_http_url)
        normalized["live_bars_ws_url"] = str(live_bars_ws_url)

        normalized["symbol"] = str(metadata.get("symbol", "ounce"))
        normalized["resolution"] = str(metadata.get("resolution", "5"))
        normalized["lookback_seconds"] = int(metadata.get("lookback_seconds", 7200))
        normalized["bars_poll_interval_seconds"] = int(
            metadata.get("bars_poll_interval_seconds", 15)
        )
        normalized["decision_interval_seconds"] = float(
            metadata.get("decision_interval_seconds", 1.0)
        )
        normalized["threshold_usd"] = float(metadata.get("threshold_usd", 1.5))
        normalized["live_subscribe_message"] = metadata.get("live_subscribe_message")
        normalized["live_ping_message"] = metadata.get("live_ping_message")
        normalized["live_ping_interval_seconds"] = int(
            metadata.get("live_ping_interval_seconds", 30)
        )
        normalized["max_bars_kept"] = int(metadata.get("max_bars_kept", 5000))
        normalized["trim_to_bars"] = int(metadata.get("trim_to_bars", 2500))
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

    async def _bars_poll_loop(
        self, session: aiohttp.ClientSession, metadata: dict[str, Any]
    ) -> None:
        while not self._stop_event.is_set() and not self._session_stop.is_set():
            end_ts = int(time.time())
            start_ts = end_ts - metadata["lookback_seconds"]

            try:
                bars = await self._fetch_bars(session, metadata, start_ts, end_ts)
                if bars:
                    await self._merge_bars(
                        bars,
                        max_bars_kept=metadata["max_bars_kept"],
                        trim_to_bars=metadata["trim_to_bars"],
                    )
                    self.log("INFO", f"HTTP poll merged {len(bars)} bars")
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.log("ERROR", f"HTTP bars poll failed: {exc}")

            await asyncio.sleep(metadata["bars_poll_interval_seconds"])

    async def _fetch_bars(
        self,
        session: aiohttp.ClientSession,
        metadata: dict[str, Any],
        start_ts: int,
        end_ts: int,
    ) -> list[dict[str, float]]:
        params = {
            "symbol": metadata["symbol"],
            "from": start_ts,
            "to": end_ts,
            "resolution": metadata["resolution"],
        }

        self.log(
            "INFO",
            f"Fetching HTTP bars url={metadata['bars_http_url']} params={params}",
        )

        async with session.get(metadata["bars_http_url"], params=params) as response:
            text = await response.text()

            if response.status >= 400:
                raise RuntimeError(
                    f"HTTP bars request failed status={response.status} body={text[:500]}"
                )

            payload = json.loads(text)

        if not isinstance(payload, list):
            raise ValueError("HTTP bars response must be a JSON list")

        normalized: list[dict[str, float]] = []
        for item in payload:
            bar = self._extract_http_bar(item)
            if bar is not None:
                normalized.append(bar)

        return normalized

    def _extract_http_bar(self, item: Any) -> Optional[dict[str, float]]:
        if not isinstance(item, dict):
            return None

        required = ("time", "open", "high", "low", "close")
        if not all(key in item for key in required):
            return None

        try:
            return {
                "ts": int(item["time"]),
                "open": float(item["open"]),
                "high": float(item["high"]),
                "low": float(item["low"]),
                "close": float(item["close"]),
            }
        except (TypeError, ValueError):
            return None

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
                            await self._handle_live_bars_message(message.data)
                            continue

                        if message.type == WSMsgType.BINARY:
                            self.log("WARNING", f"live-bars websocket sent binary frame size={len(message.data)}")
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

    async def _handle_live_bars_message(self, raw_message: str) -> None:
        try:
            payload = json.loads(raw_message)
        except json.JSONDecodeError:
            self.log("WARNING", f"Invalid JSON from live-bars websocket: {raw_message[:300]}")
            return

        bar = self._extract_ws_bar(payload)
        if bar is None:
            return

        await self._merge_bars(
            [bar],
            max_bars_kept=self.config.metadata.get("max_bars_kept", 5000),
            trim_to_bars=self.config.metadata.get("trim_to_bars", 2500),
        )

    def _extract_ws_bar(self, payload: Any) -> Optional[dict[str, float]]:
        if not isinstance(payload, dict):
            return None

        if all(key in payload for key in ("ts", "open", "high", "low", "close")):
            try:
                return {
                    "ts": int(payload["ts"]),
                    "open": float(payload["open"]),
                    "high": float(payload["high"]),
                    "low": float(payload["low"]),
                    "close": float(payload["close"]),
                }
            except (TypeError, ValueError):
                return None

        data = payload.get("data")
        if isinstance(data, dict) and all(
            key in data for key in ("ts", "open", "high", "low", "close")
        ):
            try:
                return {
                    "ts": int(data["ts"]),
                    "open": float(data["open"]),
                    "high": float(data["high"]),
                    "low": float(data["low"]),
                    "close": float(data["close"]),
                }
            except (TypeError, ValueError):
                return None

        if all(key in payload for key in ("time", "open", "high", "low", "close")):
            try:
                return {
                    "ts": int(payload["time"]),
                    "open": float(payload["open"]),
                    "high": float(payload["high"]),
                    "low": float(payload["low"]),
                    "close": float(payload["close"]),
                }
            except (TypeError, ValueError):
                return None

        if isinstance(data, dict) and all(
            key in data for key in ("time", "open", "high", "low", "close")
        ):
            try:
                return {
                    "ts": int(data["time"]),
                    "open": float(data["open"]),
                    "high": float(data["high"]),
                    "low": float(data["low"]),
                    "close": float(data["close"]),
                }
            except (TypeError, ValueError):
                return None

        return None

    async def _merge_bars(
        self,
        bars: list[dict[str, float]],
        max_bars_kept: int,
        trim_to_bars: int,
    ) -> None:
        async with self._bars_lock:
            for bar in bars:
                self._bars_by_ts[int(bar["ts"])] = bar

            if len(self._bars_by_ts) > max_bars_kept:
                sorted_ts = sorted(self._bars_by_ts.keys())
                trim_count = max(0, len(sorted_ts) - trim_to_bars)
                for ts in sorted_ts[:trim_count]:
                    self._bars_by_ts.pop(ts, None)

    async def _decision_loop(self, metadata: dict[str, Any]) -> None:
        resolution_seconds = metadata["resolution_seconds"]

        while not self._stop_event.is_set() and not self._session_stop.is_set():
            try:
                now_ts = int(time.time())
                current_bucket_start = (now_ts // resolution_seconds) * resolution_seconds
                target_closed_bar_ts = current_bucket_start - resolution_seconds

                if (
                    target_closed_bar_ts >= 0
                    and target_closed_bar_ts != self._last_reported_closed_bar_ts
                ):
                    closed_bar = await self._latest_closed_bar(resolution_seconds)
                    if closed_bar is not None:
                        await self._evaluate_closed_bar(
                            closed_bar,
                            threshold_usd=metadata["threshold_usd"],
                        )
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.log("ERROR", f"Decision loop failed: {exc}")

            await asyncio.sleep(metadata["decision_interval_seconds"])
    async def _latest_closed_bar(
        self, resolution_seconds: int
    ) -> Optional[dict[str, float]]:
        now_ts = int(time.time())

        # Start of the currently forming candle
        current_bucket_start = (now_ts // resolution_seconds) * resolution_seconds

        # Start of the most recently CLOSED candle
        target_closed_bar_ts = current_bucket_start - resolution_seconds

        if target_closed_bar_ts < 0:
            return None

        async with self._bars_lock:
            bar = self._bars_by_ts.get(target_closed_bar_ts)
            if bar is None:
                return None
            return dict(bar)
   
    async def _evaluate_closed_bar(
        self,
        bar: dict[str, float],
        threshold_usd: float,
    ) -> None:
        bar_ts = int(bar["ts"])

        if self._last_reported_closed_bar_ts == bar_ts:
            return

        price_diff = float(bar["close"]) - float(bar["open"])
        is_more_than_threshold = abs(price_diff) > threshold_usd

        message = (
            f"latest_closed_bar "
            f"ts={bar_ts} "
            f"tsnow ={int(time.time())}"
            f"open={bar['open']:.2f} "
            f"close={bar['close']:.2f} "
            f"diff={price_diff:.2f} "
            f"threshold={threshold_usd:.2f} "
            f"is_more_than_threshold={is_more_than_threshold}"
        )

        print(message, flush=True)
        self.log("INFO", message)

        if is_more_than_threshold:
            hit_message = (
                f"BAR HIT: ts={bar_ts} "
                f"open={bar['open']:.2f} "
                f"high={bar['high']:.2f} "
                f"low={bar['low']:.2f} "
                f"close={bar['close']:.2f} "
                f"diff={price_diff:.2f}"
            )
            print(hit_message, flush=True)
            self.log("INFO", hit_message)

        self._last_reported_closed_bar_ts = bar_ts