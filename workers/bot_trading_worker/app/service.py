import asyncio
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import requests

from config import Config
from .clients import (
    BadRequestError,
    HivagoldRedisClient,
    MarketDataClient,
    UserContext,
    cookie_header,
    normalize_base_url,
    normalize_domain,
    normalize_mobile,
    utc_now_ts,
)
from .modules import EmaWallStrategyModule, MarketSnapshot


LIVE_SUB_MESSAGE = {"action": "SubAdd", "subs": ["0~hivagold~xag~gold"]}
PRICE_PING_MESSAGE = {"type": "ping"}


@dataclass
class RuntimeState:
    bars_by_ts: dict[int, dict[str, float]] = field(default_factory=dict)
    latest_price: Optional[float] = None
    latest_wall: Optional[dict[str, Any]] = None
    latest_signal: Optional[dict[str, Any]] = None
    last_error: Optional[str] = None


class TradingWorkerService:
    def __init__(
        self,
        config: Config,
        redis_client: HivagoldRedisClient,
        market_client: MarketDataClient,
        logger: logging.Logger | None = None,
    ):
        self.config = config
        self.redis_client = redis_client
        self.market_client = market_client
        self.logger = logger or logging.getLogger(__name__)

        self._running = False
        self._stop_event = asyncio.Event()
        self._user_tasks: dict[str, asyncio.Task] = {}
        self._latest_signals: dict[str, dict[str, Any]] = {}
        self._listeners: set[asyncio.Queue] = set()
        self._modules = self._load_modules()

    def _load_modules(self) -> list[EmaWallStrategyModule]:
        modules: list[EmaWallStrategyModule] = []
        if getattr(self.config, "ENABLE_STRATEGY_EMA_WALL_V1", True):
            modules.append(EmaWallStrategyModule(self.config))
        return modules

    def _user_key(self, user: UserContext) -> str:
        return f"{normalize_domain(user.domain)}:{normalize_mobile(user.mobile)}"

    def _users_path(self) -> Path:
        path = Path(self.config.USERS_JSON_PATH)
        if path.is_absolute():
            return path
        if path.exists():
            return path.resolve()

        file_path = Path(__file__).resolve()
        search_roots = [Path.cwd(), file_path.parent.parent, file_path.parent.parent.parent]
        search_roots.extend(file_path.parents)
        seen_roots: set[str] = set()
        for root in search_roots:
            if str(root) in seen_roots:
                continue
            seen_roots.add(str(root))
            candidate = (root / path).resolve()
            if candidate.exists():
                return candidate
        return (file_path.parent.parent / path.name).resolve()

    def _load_users(self) -> list[UserContext]:
        users_path = self._users_path()
        if not users_path.exists():
            raise FileNotFoundError(f"Users file not found: {users_path}")

        data = json.loads(users_path.read_text(encoding="utf-8"))
        if not isinstance(data, list):
            raise ValueError(f"Users file must contain a JSON array: {users_path}")
        users: list[UserContext] = []
        for item in data:
            if not isinstance(item, dict):
                continue
            mobile = normalize_mobile(str(item.get("mobile", "")).strip())
            password = str(item.get("password", "")).strip()
            domain = str(item.get("domain", "")).strip()
            if mobile and password and domain:
                users.append(UserContext(mobile=mobile, password=password, domain=domain))
        return users

    async def start(self) -> dict[str, Any]:
        if self._running:
            return {"started": True, "users": len(self._user_tasks), "modules": len(self._modules)}
        users = self._load_users()
        self._stop_event = asyncio.Event()
        self._running = True
        for user in users:
            key = self._user_key(user)
            self._user_tasks[key] = asyncio.create_task(self._run_user(user), name=key)
        return {"started": True, "users": len(self._user_tasks), "modules": len(self._modules)}

    async def stop(self) -> dict[str, Any]:
        if not self._running:
            return {"stopped": True, "users": 0}
        self._stop_event.set()
        tasks = list(self._user_tasks.values())
        for task in tasks:
            task.cancel()
        for task in tasks:
            try:
                await task
            except asyncio.CancelledError:
                pass
            except Exception as exc:
                self.logger.warning("user task stop error: %s", exc)
        self._user_tasks.clear()
        self._running = False
        return {"stopped": True, "users": 0}

    def register_listener(self) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        self._listeners.add(queue)
        return queue

    def unregister_listener(self, queue: asyncio.Queue) -> None:
        self._listeners.discard(queue)

    def latest_signals(self) -> list[dict[str, Any]]:
        return list(self._latest_signals.values())

    async def process(self, args: Dict[str, Any]) -> Dict[str, Any]:
        action = args.get("action")
        if action == "start":
            return {"success": True, "result": await self.start()}
        if action == "stop":
            return {"success": True, "result": await self.stop()}
        if action == "status":
            return {"success": True, "result": {"running": self._running, "users": len(self._user_tasks), "signals": len(self._latest_signals), "modules": [m.name for m in self._modules]}}
        if action == "latest_signals":
            return {"success": True, "result": {"signals": self.latest_signals()}}
        return {"success": False, "error": f"Unknown action: {action}"}

    async def _publish_signal(self, signal: dict[str, Any]) -> None:
        key = f"{signal.get('domain')}:{signal.get('mobile')}:{signal.get('strategy', 'unknown')}"
        self._latest_signals[key] = signal

        for queue in list(self._listeners):
            try:
                if queue.full():
                    _ = queue.get_nowait()
                queue.put_nowait(signal)
            except Exception:
                self._listeners.discard(queue)

        try:
            await asyncio.to_thread(
                self.redis_client.publish_event,
                self.config.REDIS_MARKET_EVENT_CHANNEL,
                {"event": "signal", "payload": signal},
            )
        except Exception as exc:
            self.logger.warning("signal publish error: %s", exc)

    async def _publish_market_event(self, user: UserContext, event_type: str, payload: dict[str, Any]) -> None:
        event = {
            "event": event_type,
            "mobile": normalize_mobile(user.mobile),
            "domain": normalize_domain(user.domain),
            "ts": utc_now_ts(),
            "payload": payload,
        }
        try:
            await asyncio.to_thread(
                self.redis_client.publish_event,
                self.config.REDIS_MARKET_EVENT_CHANNEL,
                event,
            )
        except Exception as exc:
            self.logger.warning("market event publish error (%s): %s", event_type, exc)

    def _ws_urls(self, domain: str) -> dict[str, str]:
        normalized = normalize_base_url(domain)
        parsed = urlparse(normalized)
        ws_scheme = "wss" if parsed.scheme == "https" else "ws"
        ws_base = f"{ws_scheme}://{parsed.netloc}"
        return {
            "live-bars": f"{ws_base}{self.config.WS_LIVE_BARS_PATH}",
            "price": f"{ws_base}{self.config.WS_PRICE_PATH}",
            "wall": f"{ws_base}{self.config.WS_WALL_PATH}",
        }

    async def _run_user(self, user: UserContext) -> None:
        key = self._user_key(user)
        while not self._stop_event.is_set():
            try:
                await self._run_user_session(user)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                self.logger.error("user session error %s: %s", key, exc)
                await self._publish_signal(self._error_signal(user, f"runtime_error: {str(exc)}"))
                await asyncio.sleep(3)

    async def _run_user_session(self, user: UserContext) -> None:
        session_data = self.redis_client.get_session_data(user.mobile, user.domain)
        if not session_data or not isinstance(session_data, dict):
            await self._publish_signal(self._error_signal(user, "Session not found/invalid in file storage for this mobile/domain"))
            await asyncio.sleep(5)
            return

        cookies = session_data.get("cookies") or {}
        if not isinstance(cookies, dict) or not cookies:
            await self._publish_signal(self._error_signal(user, "Cookies are missing in stored user session"))
            await asyncio.sleep(5)
            return

        headers = session_data.get("headers") or {}
        if not isinstance(headers, dict):
            headers = {}

        http_session = self.market_client.build_http_session(cookies, user.domain, headers=headers)
        try:
            await asyncio.to_thread(self.market_client.warmup, http_session, user.domain)
        except BadRequestError as exc:
            await self._publish_signal(self._error_signal(user, exc.message, status="bad_request"))
            await asyncio.sleep(5)
            return

        state = RuntimeState()
        session_stop_event = asyncio.Event()
        ws_headers = self._build_ws_headers(user.domain, http_session, cookies)
        ws_urls = self._ws_urls(user.domain)

        tasks = [
            asyncio.create_task(self._bars_loop(user, http_session, state, session_stop_event)),
            asyncio.create_task(self._signal_loop(user, state, session_stop_event)),
            asyncio.create_task(self.market_client.ws_connect("live-bars", ws_urls["live-bars"], ws_headers, session_stop_event, on_message=lambda msg: self._on_live_bars_message(user, msg, state), on_open=self._on_open_live, on_disconnect=lambda reason: self._on_ws_disconnect(user, "live-bars", reason))),
            asyncio.create_task(self.market_client.ws_connect("price", ws_urls["price"], ws_headers, session_stop_event, on_message=lambda msg: self._on_price_message(user, msg, state), on_open=self._on_open_price, on_disconnect=lambda reason: self._on_ws_disconnect(user, "price", reason))),
            asyncio.create_task(self.market_client.ws_connect("wall", ws_urls["wall"], ws_headers, session_stop_event, on_message=lambda msg: self._on_wall_message(user, msg, state), on_disconnect=lambda reason: self._on_ws_disconnect(user, "wall", reason))),
        ]

        try:
            while not self._stop_event.is_set():
                await asyncio.sleep(1)
        finally:
            session_stop_event.set()
            for task in tasks:
                task.cancel()
            for task in tasks:
                try:
                    await task
                except Exception:
                    pass

    def _build_ws_headers(self, domain: str, session: requests.Session, cookies: dict[str, str]) -> dict[str, str]:
        normalized = normalize_base_url(domain)
        parsed = urlparse(normalized)
        origin = f"{parsed.scheme}://{parsed.netloc}"

        return {
            "User-Agent": session.headers.get("User-Agent", "Mozilla/5.0"),
            "Cookie": cookie_header(cookies),
            "Origin": origin,
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Accept-Language": session.headers.get("Accept-Language", "en-US,en;q=0.9"),
        }

    async def _bars_loop(self, user: UserContext, session: requests.Session, state: RuntimeState, stop_event: asyncio.Event) -> None:
        while not stop_event.is_set():
            end_ts = utc_now_ts()
            start_ts = end_ts - self.config.LOOKBACK_SECONDS
            try:
                bars = await asyncio.to_thread(self.market_client.fetch_bars, session, user.domain, self.config.BARS_SYMBOL, self.config.BARS_RESOLUTION, start_ts, end_ts)
                for bar in bars:
                    state.bars_by_ts[int(bar["ts"])] = bar
                if len(state.bars_by_ts) > 5000:
                    for ts in sorted(state.bars_by_ts.keys())[:-2500]:
                        state.bars_by_ts.pop(ts, None)
                state.last_error = None
            except BadRequestError as exc:
                state.last_error = exc.message
                await self._publish_signal(self._error_signal(user, exc.message, status="bad_request"))
            except Exception as exc:
                state.last_error = str(exc)
            await asyncio.sleep(self.config.BARS_POLL_INTERVAL_SECONDS)

    async def _signal_loop(self, user: UserContext, state: RuntimeState, stop_event: asyncio.Event) -> None:
        while not stop_event.is_set():
            signals = self._build_module_signals(user, state)
            for signal in signals:
                state.latest_signal = signal
                await self._publish_signal(signal)
            await asyncio.sleep(self.config.SIGNAL_INTERVAL_SECONDS)

    async def _on_ws_disconnect(self, user: UserContext, stream_name: str, reason: str) -> None:
        await self._publish_signal(self._error_signal(user, f"{stream_name} websocket disconnected: {reason}", status="ws_disconnected"))

    async def _on_open_live(self, ws: Any) -> Optional[asyncio.Task]:
        await ws.send(json.dumps(LIVE_SUB_MESSAGE, ensure_ascii=False))
        return None

    async def _on_open_price(self, ws: Any) -> Optional[asyncio.Task]:
        async def ping_loop():
            while True:
                await asyncio.sleep(30)
                await ws.send(json.dumps(PRICE_PING_MESSAGE, ensure_ascii=False))

        return asyncio.create_task(ping_loop())

    async def _on_live_bars_message(self, user: UserContext, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
            bar = self._extract_bar(payload)
            if bar:
                state.bars_by_ts[int(bar["ts"])] = bar
                await self._publish_market_event(user, "live-bars", bar)
        except Exception:
            return

    async def _on_price_message(self, user: UserContext, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
        except Exception:
            return

        price = payload.get("price")
        if price is None and isinstance(payload.get("data"), dict):
            price = payload["data"].get("price")
        if price is None:
            return
        try:
            state.latest_price = float(price)
        except Exception:
            return
        await self._publish_market_event(user, "price", {"price": state.latest_price, "symbol": self.config.BARS_SYMBOL})

    async def _on_wall_message(self, user: UserContext, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
        except Exception:
            return
        if isinstance(payload, dict):
            state.latest_wall = payload
            await self._publish_market_event(user, "wall", payload)

    def _extract_bar(self, payload: dict[str, Any]) -> Optional[dict[str, float]]:
        if all(k in payload for k in ["ts", "open", "high", "low", "close"]):
            return {"ts": int(payload["ts"]), "open": float(payload["open"]), "high": float(payload["high"]), "low": float(payload["low"]), "close": float(payload["close"])}
        data = payload.get("data")
        if isinstance(data, dict) and all(k in data for k in ["ts", "open", "high", "low", "close"]):
            return {"ts": int(data["ts"]), "open": float(data["open"]), "high": float(data["high"]), "low": float(data["low"]), "close": float(data["close"])}
        return None

    def _build_module_signals(self, user: UserContext, state: RuntimeState) -> list[dict[str, Any]]:
        if len(state.bars_by_ts) < 50:
            return [self._error_signal(user, "Waiting for enough market bars", strategy=module.name) for module in self._modules]
        bars = [state.bars_by_ts[k] for k in sorted(state.bars_by_ts.keys())]
        now_price = state.latest_price if state.latest_price is not None else bars[-1]["close"]
        snapshot = MarketSnapshot(now_ts=utc_now_ts(), bars=bars, latest_price=now_price, latest_wall=state.latest_wall, last_error=state.last_error)
        base_payload = {
            "ts": snapshot.now_ts,
            "mobile": normalize_mobile(user.mobile),
            "domain": normalize_domain(user.domain),
            "symbol": self.config.BARS_SYMBOL,
        }
        return [module.evaluate(snapshot, base_payload) for module in self._modules]

    def _error_signal(self, user: UserContext, error: str, status: str = "error", strategy: str = "system") -> dict[str, Any]:
        return {
            "ts": utc_now_ts(),
            "mobile": normalize_mobile(user.mobile),
            "domain": normalize_domain(user.domain),
            "status": status,
            "bias": "neutral",
            "score": 0.0,
            "confidence": 0.0,
            "reasons": [],
            "recommendation": None,
            "metrics": {},
            "strategy": strategy,
            "error": error,
        }
