import asyncio
import json
import logging
import ssl
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Awaitable, Callable, Dict, Optional
from urllib.parse import urlparse

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


class SessionStore:
    def __init__(self, users_root: str):
        self.users_root = Path(users_root)
        self.logger = logging.getLogger(__name__)
        self._cache: dict[Path, tuple[float, dict[str, Any]]] = {}

    def _user_file(self, mobile: str) -> Path:
        normalized_mobile = normalize_mobile(mobile) or (mobile or "").strip()
        return self.users_root / normalized_mobile / "User_info.json"

    def _read_user_info(self, mobile: str) -> dict[str, Any]:
        file_path = self._user_file(mobile)
        if not file_path.exists():
            return {"sessions": {}}
        stat = file_path.stat()
        cache_entry = self._cache.get(file_path)
        if cache_entry and cache_entry[0] == stat.st_mtime:
            return cache_entry[1]
        try:
            with file_path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
        except (json.JSONDecodeError, OSError):
            self.logger.warning("Corrupted user info file: %s", file_path)
            return {"sessions": {}}
        if not isinstance(data, dict):
            return {"sessions": {}}
        if not isinstance(data.get("sessions"), dict):
            data["sessions"] = {}
        self._cache[file_path] = (stat.st_mtime, data)
        return data

    def get_session_data(self, mobile: str, domain: str) -> Optional[Dict[str, Any]]:
        user_info = self._read_user_info(mobile)
        sessions = user_info.get("sessions") or {}
        for candidate in domain_candidates(domain):
            data = sessions.get(candidate)
            if isinstance(data, dict):
                return data
        return None


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
    parsed = urlparse((domain or "").strip() if "://" in (domain or "") else f"//{(domain or '').strip()}")
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
    unique: list[str] = []
    for item in candidates:
        if item and item not in unique:
            unique.append(item)
    return unique


class MarketDataClient:
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)

    def build_http_session(self, cookies: Dict[str, str], domain: str, headers: Optional[Dict[str, str]] = None) -> requests.Session:
        base_site = normalize_base_url(domain)
        parsed = urlparse(base_site)
        host = parsed.hostname or normalize_domain_key(domain)
        room_prefix = f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        referer = f"{base_site}{room_prefix}/"
        session = requests.Session()
        prepared_headers: Dict[str, str] = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
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
        prepared_headers["Referer"] = referer
        prepared_headers["Origin"] = base_site
        session.headers.update(prepared_headers)

        for key, value in cookies.items():
            if key and value is not None:
                session.cookies.set(key, str(value), domain=host, path="/")

        if "csrftoken" in cookies:
            session.headers["X-CSRFToken"] = cookies["csrftoken"]
            session.headers["X-Csrftoken"] = cookies["csrftoken"]

        return session

    def warmup(self, session: requests.Session, domain: str) -> None:
        base_site = normalize_base_url(domain)
        room_prefix = f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        referer = f"{base_site}{room_prefix}/"
        response = session.get(referer, timeout=20, allow_redirects=True)
        if response.status_code == 400:
            raise BadRequestError(response.text)
        response.raise_for_status()

    def fetch_bars(self, session: requests.Session, domain: str, symbol: str, resolution: str, start_ts: int, end_ts: int) -> list[dict[str, Any]]:
        base_site = normalize_base_url(domain)
        url = f"{base_site}{self.config.BARS_API_PATH}"
        response = session.get(url, params={"symbol": symbol, "from": start_ts, "to": end_ts, "resolution": resolution}, timeout=30)
        if response.status_code == 400:
            raise BadRequestError(response.text)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and all(k in data for k in ["t", "o", "h", "l", "c"]):
            return [{"ts": int(data["t"][idx]), "open": float(data["o"][idx]), "high": float(data["h"][idx]), "low": float(data["l"][idx]), "close": float(data["c"][idx])} for idx in range(len(data["t"]))]
        if isinstance(data, list):
            bars: list[dict[str, Any]] = []
            for item in data:
                ts = item.get("ts", item.get("time"))
                if ts is None:
                    continue
                bars.append({"ts": int(ts), "open": float(item["open"]), "high": float(item["high"]), "low": float(item["low"]), "close": float(item["close"])})
            return bars
        raise ValueError("Unexpected bars API response shape")

    async def ws_connect(self, name: str, url: str, headers: Dict[str, str], stop_event: asyncio.Event, on_message: Callable[[str], Awaitable[None]], on_open: Optional[Callable[[Any], Awaitable[Optional[asyncio.Task]]]] = None, on_disconnect: Optional[Callable[[str], Awaitable[None]]] = None) -> None:
        parsed_url = urlparse(url)
        ssl_context = ssl.create_default_context() if parsed_url.scheme == "wss" else None
        while not stop_event.is_set():
            background_task: Optional[asyncio.Task] = None
            try:
                ws_headers = dict(headers)
                origin = ws_headers.pop("Origin", None)
                kwargs: Dict[str, Any] = {
                    "additional_headers": ws_headers,
                    "origin": origin,
                    "ping_interval": None,
                    "ping_timeout": None,
                    "close_timeout": 10,
                    "max_size": None,
                }
                if ssl_context is not None:
                    kwargs["ssl"] = ssl_context
                async with websockets.connect(url, **kwargs) as ws:
                    self.logger.info("Connected ws %s %s", name, url)
                    if on_open:
                        background_task = await on_open(ws)
                    async for message in ws:
                        await on_message(message)
            except ConnectionClosed as exc:
                if not stop_event.is_set() and on_disconnect:
                    await on_disconnect(f"closed: {getattr(exc, 'code', None)}")
            except Exception as exc:
                if not stop_event.is_set() and on_disconnect:
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


class TradingExecutionClient:
    def __init__(self, config: Config):
        self.config = config

    def price_tick(self, *, session: requests.Session, mobile: str, price: float, symbol: str) -> dict[str, Any]:
        url = f"{self.config.SIMULATOR_WORKER_URL}/portfolio/price"
        return self._request("POST", url, session, {"mobile": mobile, "price": price, "symbol": symbol}, include_api_key=True)

    def create_order(self, *, run_mode: str, session: requests.Session, domain: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._request("POST", self._create_order_url(run_mode, domain), session, payload)


    def update_order(self, *, run_mode: str, session: requests.Session, domain: str, order_id: int | str, payload: dict[str, Any]) -> dict[str, Any]:
        if run_mode == "simulator":
            mobile = payload_mobile(session)
            if not mobile:
                raise ValueError("mobile header is required for simulator update")
            url = f"{self.config.SIMULATOR_WORKER_URL}/portfolio/users/{mobile}/positions/{order_id}"
            return self._request("PATCH", url, session, payload, include_api_key=True)
        update_url = f"{normalize_base_url(domain)}{self.config.ROOM_PREFIX}/api/order/update/"
        body = dict(payload)
        body["order_id"] = order_id
        return self._request("POST", update_url, session, body)

    def close_order(self, *, run_mode: str, session: requests.Session, domain: str, order_id: int | str, close_price: float | None = None, reason: str | None = None) -> dict[str, Any]:
        if run_mode == "simulator":
            mobile = payload_mobile(session)
            if not mobile:
                raise ValueError("mobile header is required for simulator close")
            url = f"{self.config.SIMULATOR_WORKER_URL}/portfolio/users/{mobile}/positions/{order_id}/close"
            body = {"close_price": close_price, "reason": reason or "strategy-close"}
            return self._request("POST", url, session, body, include_api_key=True)
        close_url = f"{normalize_base_url(domain)}{self.config.ROOM_PREFIX}/api/order/close/"
        return self._request("POST", close_url, session, {"order_id": order_id})

    def _create_order_url(self, run_mode: str, domain: str) -> str:
        if run_mode == "simulator":
            return f"{self.config.SIMULATOR_WORKER_URL}/portfolio/orders"
        room_prefix = f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        return f"{normalize_base_url(domain)}{room_prefix}/api/order/create/"

    def _request(self, method: str, url: str, session: requests.Session, payload: dict[str, Any], include_api_key: bool = False) -> dict[str, Any]:
        headers = dict(session.headers)
        if include_api_key:
            headers["x-api-key"] = self.config.SIMULATOR_API_KEY
        response = requests.request(method, url, json=payload, cookies=session.cookies.get_dict(), headers=headers, timeout=20)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict):
            return data
        return {"raw": data}


def payload_mobile(session: requests.Session) -> str:
    return str(session.headers.get("X-Mobile", "")).strip()


def build_clients(config: Config) -> tuple[SessionStore, MarketDataClient, TradingExecutionClient]:
    return SessionStore(config.USERS_STORAGE_DIR), MarketDataClient(config), TradingExecutionClient(config)


def cookie_header(cookies: Dict[str, str]) -> str:
    return "; ".join(f"{key}={value}" for key, value in cookies.items() if key and value is not None)


def utc_now_ts() -> int:
    return int(time.time())
