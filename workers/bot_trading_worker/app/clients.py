import asyncio
import json
import logging
import ssl
import time
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Dict, Optional
from urllib.parse import urlparse

import redis
import requests
import websockets
from websockets.exceptions import ConnectionClosed

from config import Config


class BadRequestError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


@dataclass
class UserContext:
    mobile: str
    password: str
    domain: str


def normalize_mobile(mobile: str) -> str:
    value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
    if not value:
        return value
    if value.startswith("0098") and len(value) >= 12:
        value = "0" + value[4:]
    elif value.startswith("98") and len(value) >= 12:
        value = "0" + value[2:]
    elif len(value) == 10 and not value.startswith("0"):
        value = f"0{value}"
    return value


def normalize_domain_key(domain: str) -> str:
    parsed = urlparse(
        (domain or "").strip()
        if "://" in (domain or "")
        else f"//{(domain or '').strip()}"
    )
    hostname = (parsed.hostname or "").strip().lower()
    if not hostname:
        host_port = parsed.netloc or parsed.path
        return host_port.split("/", 1)[0].strip().lower()
    if parsed.port:
        return f"{hostname}:{parsed.port}"
    return hostname


def normalize_base_url(domain: str) -> str:
    value = (domain or "").strip()
    if not value:
        return value
    parsed = urlparse(value if "://" in value else f"https://{value}")
    if parsed.hostname:
        host = parsed.hostname.lower()
        if parsed.port:
            host = f"{host}:{parsed.port}"
        scheme = parsed.scheme or "https"
        return f"{scheme}://{host}"
    # Fallback for malformed input, keep behavior predictable.
    normalized = value.rstrip("/")
    if not normalized.startswith("http://") and not normalized.startswith("https://"):
        normalized = f"https://{normalized}"
    return normalized


def normalize_domain(domain: str) -> str:
    return normalize_base_url(domain)


def domain_candidates(domain: str) -> list[str]:
    raw = (domain or "").strip().rstrip("/")
    normalized = normalize_base_url(raw)
    candidates: list[str] = []
    domain_key = normalize_domain_key(raw)
    if domain_key:
        candidates.append(domain_key)
    if raw:
        candidates.append(raw)
    if normalized:
        candidates.append(normalized)
    parsed_raw = urlparse(raw if "://" in raw else f"//{raw}")
    if parsed_raw.netloc:
        candidates.append(parsed_raw.netloc.lower())
    if parsed_raw.hostname:
        candidates.append(parsed_raw.hostname.lower())
    parsed_normalized = urlparse(normalized)
    if parsed_normalized.netloc:
        candidates.append(parsed_normalized.netloc.lower())
    if parsed_normalized.hostname:
        candidates.append(parsed_normalized.hostname.lower())
    # keep order but remove duplicates
    unique: list[str] = []
    for item in candidates:
        if item and item not in unique:
            unique.append(item)
    return unique


class HivagoldRedisClient:
    def __init__(self, redis_pool: redis.ConnectionPool):
        self.redis_pool = redis_pool
        self.logger = logging.getLogger(__name__)
        # Backward compatibility: existing service code accesses `.redis_client`.
        # Keep a shared redis handle for pub/sub operations.
        self.redis_client = self._redis_connection()

    def _redis_connection(self) -> redis.Redis:
        return redis.Redis(connection_pool=self.redis_pool, decode_responses=True)

    def get_session_data(self, mobile: str, domain: str) -> Optional[Dict[str, Any]]:
        conn = self._redis_connection()
        normalized_mobile = normalize_mobile(mobile)
        mobile_candidates: list[str] = []
        for candidate in [normalized_mobile, (mobile or "").strip()]:
            if candidate and candidate not in mobile_candidates:
                mobile_candidates.append(candidate)

        attempted_keys: list[str] = []
        for key_domain in domain_candidates(domain):
            for mobile_candidate in mobile_candidates:
                redis_key = f"{key_domain}:{mobile_candidate}"
                attempted_keys.append(redis_key)
                raw = conn.get(redis_key)
                if not raw:
                    continue
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError:
                    self.logger.error(
                        "Invalid JSON for redis session key=%s", redis_key
                    )
                    continue
                if isinstance(data, dict):
                    return data
                self.logger.warning(
                    "Unexpected redis session payload type key=%s type=%s",
                    redis_key,
                    type(data).__name__,
                )
        self.logger.debug(
            "No redis session found domain=%s mobile=%s attempts=%s",
            domain,
            normalized_mobile,
            len(attempted_keys),
        )
        return None

    def publish_event(self, channel: str, event: Dict[str, Any]) -> int:
        payload = json.dumps(event, ensure_ascii=False)
        return int(self.redis_client.publish(channel, payload))


class MarketDataClient:
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)

    def build_http_session(
        self,
        cookies: Dict[str, str],
        domain: str,
        headers: Optional[Dict[str, str]] = None,
    ) -> requests.Session:
        base_site = normalize_base_url(domain)
        parsed = urlparse(base_site)
        host = parsed.hostname or normalize_domain_key(domain)
        room_prefix = (
            f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        )
        referer = f"{base_site}{room_prefix}/"
        session = requests.Session()
        prepared_headers: Dict[str, str] = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/145.0.0.0 Safari/537.36"
            ),
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Referer": referer,
            "Origin": base_site,
            "X-Requested-With": "XMLHttpRequest",
        }
        if headers:
            prepared_headers.update(headers)
        # Always force domain-sensitive headers from current user domain.
        prepared_headers["Referer"] = referer
        prepared_headers["Origin"] = base_site
        session.headers.update(prepared_headers)

        for key, value in cookies.items():
            if not key or value is None:
                continue
            session.cookies.set(key, str(value), domain=host, path="/")

        if "csrftoken" in cookies:
            session.headers["X-CSRFToken"] = cookies["csrftoken"]
            session.headers["X-Csrftoken"] = cookies["csrftoken"]

        return session

    def warmup(self, session: requests.Session, domain: str) -> None:
        base_site = normalize_base_url(domain)
        room_prefix = (
            f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        )
        referer = f"{base_site}{room_prefix}/"
        response = session.get(referer, timeout=20, allow_redirects=True)
        if response.status_code == 400:
            raise BadRequestError(response.text)
        response.raise_for_status()

    def fetch_bars(
        self,
        session: requests.Session,
        domain: str,
        symbol: str,
        resolution: str,
        start_ts: int,
        end_ts: int,
    ) -> list[dict[str, Any]]:
        base_site = normalize_base_url(domain)
        url = f"{base_site}{self.config.BARS_API_PATH}"
        params = {
            "symbol": symbol,
            "from": start_ts,
            "to": end_ts,
            "resolution": resolution,
        }

        response = session.get(url, params=params, timeout=30)
        if response.status_code == 400:
            raise BadRequestError(response.text)
        response.raise_for_status()

        data = response.json()
        if isinstance(data, dict) and all(k in data for k in ["t", "o", "h", "l", "c"]):
            size = len(data["t"])
            return [
                {
                    "ts": int(data["t"][idx]),
                    "open": float(data["o"][idx]),
                    "high": float(data["h"][idx]),
                    "low": float(data["l"][idx]),
                    "close": float(data["c"][idx]),
                }
                for idx in range(size)
            ]

        if isinstance(data, list):
            bars: list[dict[str, Any]] = []
            for item in data:
                ts = item.get("ts", item.get("time"))
                if ts is None:
                    continue
                bars.append(
                    {
                        "ts": int(ts),
                        "open": float(item["open"]),
                        "high": float(item["high"]),
                        "low": float(item["low"]),
                        "close": float(item["close"]),
                    }
                )
            return bars

        raise ValueError("Unexpected bars API response shape")

    async def ws_connect(
        self,
        name: str,
        url: str,
        headers: Dict[str, str],
        stop_event: asyncio.Event,
        on_message: Callable[[str], Awaitable[None]],
        on_open: Optional[Callable[[Any], Awaitable[Optional[asyncio.Task]]]] = None,
        on_disconnect: Optional[Callable[[str], Awaitable[None]]] = None,
    ) -> None:
        parsed_url = urlparse(url)
        ssl_context = (
            ssl.create_default_context() if parsed_url.scheme == "wss" else None
        )
        while not stop_event.is_set():
            background_task: Optional[asyncio.Task] = None
            try:
                connect_kwargs: Dict[str, Any] = {
                    "additional_headers": headers,
                    "origin": headers.get("Origin"),
                    "ping_interval": None,
                    "ping_timeout": None,
                    "close_timeout": 10,
                    "max_size": None,
                }
                if ssl_context is not None:
                    connect_kwargs["ssl"] = ssl_context
                async with websockets.connect(url, **connect_kwargs) as ws:
                    self.logger.info("Connected ws %s %s", name, url)
                    if on_open:
                        background_task = await on_open(ws)
                    async for message in ws:
                        await on_message(message)
            except ConnectionClosed as exc:
                if not stop_event.is_set():
                    self.logger.warning(
                        "ws %s closed code=%s reason=%s",
                        name,
                        getattr(exc, "code", None),
                        getattr(exc, "reason", ""),
                    )
                    if on_disconnect is not None:
                        await on_disconnect(f"closed: {getattr(exc, 'code', None)}")
            except Exception as exc:
                if not stop_event.is_set():
                    self.logger.warning("ws %s error: %s", name, exc)
                    if on_disconnect is not None:
                        await on_disconnect(str(exc))
            finally:
                if background_task:
                    background_task.cancel()
                    try:
                        await background_task
                    except Exception:
                        pass
            if not stop_event.is_set():
                await asyncio.sleep(3)


def build_clients(config: Config) -> tuple[HivagoldRedisClient, MarketDataClient]:
    redis_password = config.REDIS_PASSWORD.strip() or None
    redis_pool = redis.ConnectionPool(
        host=config.REDIS_HOST,
        port=config.REDIS_PORT,
        db=config.REDIS_DB,
        password=redis_password,
        decode_responses=True,
    )
    return HivagoldRedisClient(redis_pool), MarketDataClient(config)


def cookie_header(cookies: Dict[str, str]) -> str:
    return "; ".join(
        f"{key}={value}" for key, value in cookies.items() if key and value is not None
    )


def utc_now_ts() -> int:
    return int(time.time())
