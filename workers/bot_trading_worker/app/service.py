import asyncio
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import requests

from config import Config
from .clients import BadRequestError, MarketDataClient, SessionStore, TradingExecutionClient, UserContext, cookie_header, normalize_base_url, normalize_domain, normalize_mobile, utc_now_ts

LIVE_SUB_MESSAGE = {"action": "SubAdd", "subs": ["0~hivagold~xag~gold"]}
PRICE_PING_MESSAGE = {"type": "ping"}


@dataclass
class RuntimeState:
    bars_by_ts: dict[int, dict[str, float]] = field(default_factory=dict)
    latest_price: Optional[float] = None
    latest_wall: Optional[dict[str, Any]] = None
    external_price: Optional[float] = None
    last_error: Optional[str] = None


@dataclass
class BotThreadConfig:
    mobile: str
    password: str
    domain: str
    strategy: str = "pending"
    room: str = "xag"
    run_mode: str = "simulator"
    active: bool = True
    metadata: dict[str, Any] = field(default_factory=dict)


class TradingWorkerService:
    def __init__(self, config: Config, session_store: SessionStore, market_client: MarketDataClient, execution_client: TradingExecutionClient, logger: logging.Logger | None = None):
        self.config = config
        self.session_store = session_store
        self.market_client = market_client
        self.execution_client = execution_client
        self.logger = logger or logging.getLogger(__name__)

        self._running = False
        self._stop_event = asyncio.Event()
        self._user_tasks: dict[str, asyncio.Task] = {}
        self._bot_configs: dict[str, BotThreadConfig] = {}
        self._latest_events: dict[str, dict[str, Any]] = {}
        self._listeners: set[asyncio.Queue] = set()

    def _user_key(self, mobile: str, domain: str) -> str:
        return f"{normalize_domain(domain)}:{normalize_mobile(mobile)}"

    def _users_path(self) -> Path:
        path = Path(self.config.USERS_JSON_PATH)
        if path.is_absolute():
            return path
        if path.exists():
            return path.resolve()
        file_path = Path(__file__).resolve()
        return (file_path.parent.parent / path.name).resolve()

    def _load_bots(self) -> list[BotThreadConfig]:
        data = json.loads(self._users_path().read_text(encoding="utf-8"))
        bots: list[BotThreadConfig] = []
        for item in data:
            if not isinstance(item, dict):
                continue
            bot = BotThreadConfig(
                mobile=normalize_mobile(str(item.get("mobile", "")).strip()),
                password=str(item.get("password", "")).strip(),
                domain=str(item.get("domain", "")).strip(),
                strategy=str(item.get("strategy", "pending")).strip() or "pending",
                room=str(item.get("room", "xag")).strip() or "xag",
                run_mode=str(item.get("run_mode", "simulator")).strip() or "simulator",
                active=bool(item.get("active", True)),
                metadata=item.get("metadata") if isinstance(item.get("metadata"), dict) else {},
            )
            if bot.mobile and bot.password and bot.domain:
                bots.append(bot)
        return bots

    async def start(self) -> dict[str, Any]:
        if self._running:
            return {"started": True, "bots": len(self._user_tasks)}
        self._stop_event = asyncio.Event()
        self._running = True
        for bot in self._load_bots():
            key = self._user_key(bot.mobile, bot.domain)
            self._bot_configs[key] = bot
            if bot.active:
                self._user_tasks[key] = asyncio.create_task(self._run_bot(bot), name=key)
        return {"started": True, "bots": len(self._user_tasks)}

    async def stop(self) -> dict[str, Any]:
        if not self._running:
            return {"stopped": True, "bots": 0}
        self._stop_event.set()
        await self._stop_tasks()
        self._running = False
        return {"stopped": True, "bots": 0}

    async def _stop_tasks(self):
        tasks = list(self._user_tasks.values())
        for task in tasks:
            task.cancel()
        for task in tasks:
            try:
                await task
            except Exception:
                pass
        self._user_tasks.clear()

    def register_listener(self) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        self._listeners.add(queue)
        return queue

    def unregister_listener(self, queue: asyncio.Queue) -> None:
        self._listeners.discard(queue)

    def latest_signals(self) -> list[dict[str, Any]]:
        return list(self._latest_events.values())

    async def process(self, args: Dict[str, Any]) -> Dict[str, Any]:
        action = args.get("action")
        if action == "start":
            return {"success": True, "result": await self.start()}
        if action == "stop":
            return {"success": True, "result": await self.stop()}
        if action == "status":
            return {"success": True, "result": {"running": self._running, "active_bots": len(self._user_tasks), "configured_bots": len(self._bot_configs)}}
        if action == "list_bots":
            return {"success": True, "result": {"bots": [self._bot_to_dict(cfg) for cfg in self._bot_configs.values()]}}
        if action == "activate_bot":
            return await self._toggle_bot(args, activate=True)
        if action == "deactivate_bot":
            return await self._toggle_bot(args, activate=False)
        return {"success": False, "error": f"Unknown action: {action}"}

    async def _toggle_bot(self, args: Dict[str, Any], activate: bool) -> Dict[str, Any]:
        key = self._user_key(args.get("mobile", ""), args.get("domain", ""))
        bot = self._bot_configs.get(key)
        if not bot:
            return {"success": False, "error": "Bot not found"}
        bot.active = activate
        if activate and key not in self._user_tasks:
            self._user_tasks[key] = asyncio.create_task(self._run_bot(bot), name=key)
        if not activate and key in self._user_tasks:
            task = self._user_tasks.pop(key)
            task.cancel()
        return {"success": True, "result": {"mobile": bot.mobile, "domain": bot.domain, "active": bot.active}}

    def _bot_to_dict(self, bot: BotThreadConfig) -> dict[str, Any]:
        return {"mobile": bot.mobile, "domain": bot.domain, "strategy": bot.strategy, "room": bot.room, "run_mode": bot.run_mode, "active": bot.active, "metadata": bot.metadata}

    async def _publish_event(self, payload: dict[str, Any]) -> None:
        key = f"{payload.get('domain')}:{payload.get('mobile')}:{payload.get('event')}"
        self._latest_events[key] = payload
        for queue in list(self._listeners):
            try:
                if queue.full():
                    _ = queue.get_nowait()
                queue.put_nowait(payload)
            except Exception:
                self._listeners.discard(queue)

    async def _run_bot(self, bot: BotThreadConfig) -> None:
        user = UserContext(mobile=bot.mobile, password=bot.password, domain=bot.domain)
        while not self._stop_event.is_set() and bot.active:
            try:
                await self._run_user_session(user, bot)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                await self._publish_event(self._event(bot, "runtime_error", {"error": str(exc)}))
                await asyncio.sleep(3)

    async def _run_user_session(self, user: UserContext, bot: BotThreadConfig) -> None:
        session_data = self.session_store.get_session_data(user.mobile, user.domain)
        if not session_data or not isinstance(session_data, dict):
            await self._publish_event(self._event(bot, "session_error", {"error": "Session not found in file storage"}))
            await asyncio.sleep(5)
            return

        cookies = session_data.get("cookies") or {}
        headers = session_data.get("headers") if isinstance(session_data.get("headers"), dict) else {}
        if not isinstance(cookies, dict) or not cookies:
            await self._publish_event(self._event(bot, "session_error", {"error": "Cookies missing"}))
            await asyncio.sleep(5)
            return

        http_session = self.market_client.build_http_session(cookies, user.domain, headers=headers)
        http_session.headers["X-Mobile"] = user.mobile
        await asyncio.to_thread(self.market_client.warmup, http_session, user.domain)

        state = RuntimeState()
        session_stop_event = asyncio.Event()
        ws_headers = self._build_ws_headers(user.domain, http_session, cookies)
        ws_urls = self._ws_urls(user.domain)

        tasks = [
            asyncio.create_task(self._bars_loop(user, bot, http_session, state, session_stop_event)),
            asyncio.create_task(self.market_client.ws_connect("live-bars", ws_urls["live-bars"], ws_headers, session_stop_event, on_message=lambda msg: self._on_live_bars_message(bot, msg, state), on_open=self._on_open_live, on_disconnect=lambda reason: self._on_ws_disconnect(bot, "live-bars", reason))),
            asyncio.create_task(self.market_client.ws_connect("price", ws_urls["price"], ws_headers, session_stop_event, on_message=lambda msg: self._on_price_message(bot, user, msg, state, http_session), on_open=self._on_open_price, on_disconnect=lambda reason: self._on_ws_disconnect(bot, "price", reason))),
            asyncio.create_task(self.market_client.ws_connect("wall", ws_urls["wall"], ws_headers, session_stop_event, on_message=lambda msg: self._on_wall_message(bot, msg, state), on_disconnect=lambda reason: self._on_ws_disconnect(bot, "wall", reason))),
        ]
        if ws_urls.get("external-price"):
            tasks.append(asyncio.create_task(self.market_client.ws_connect("external-price", ws_urls["external-price"], ws_headers, session_stop_event, on_message=lambda msg: self._on_external_price_message(bot, msg, state), on_disconnect=lambda reason: self._on_ws_disconnect(bot, "external-price", reason))))

        try:
            while not self._stop_event.is_set() and bot.active:
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

    def _event(self, bot: BotThreadConfig, event: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {"ts": utc_now_ts(), "mobile": bot.mobile, "domain": normalize_domain(bot.domain), "strategy": bot.strategy, "run_mode": bot.run_mode, "event": event, "payload": payload}

    def _ws_urls(self, domain: str) -> dict[str, str]:
        normalized = normalize_base_url(domain)
        parsed = urlparse(normalized)
        ws_scheme = "wss" if parsed.scheme == "https" else "ws"
        ws_base = f"{ws_scheme}://{parsed.netloc}"
        urls = {
            "live-bars": f"{ws_base}{self.config.WS_LIVE_BARS_PATH}",
            "price": f"{ws_base}{self.config.WS_PRICE_PATH}",
            "wall": f"{ws_base}{self.config.WS_WALL_PATH}",
        }
        if self.config.WS_EXTERNAL_PRICE_URL.strip():
            urls["external-price"] = self.config.WS_EXTERNAL_PRICE_URL.strip()
        return urls

    def _build_ws_headers(self, domain: str, session: requests.Session, cookies: dict[str, str]) -> dict[str, str]:
        normalized = normalize_base_url(domain)
        parsed = urlparse(normalized)
        origin = f"{parsed.scheme}://{parsed.netloc}"
        return {"User-Agent": session.headers.get("User-Agent", "Mozilla/5.0"), "Cookie": cookie_header(cookies), "Origin": origin, "Pragma": "no-cache", "Cache-Control": "no-cache", "Accept-Language": session.headers.get("Accept-Language", "en-US,en;q=0.9")}

    async def _bars_loop(self, user: UserContext, bot: BotThreadConfig, session: requests.Session, state: RuntimeState, stop_event: asyncio.Event) -> None:
        while not stop_event.is_set():
            end_ts = utc_now_ts()
            try:
                bars = await asyncio.to_thread(self.market_client.fetch_bars, session, user.domain, self.config.BARS_SYMBOL, self.config.BARS_RESOLUTION, end_ts - self.config.LOOKBACK_SECONDS, end_ts)
                for bar in bars:
                    state.bars_by_ts[int(bar["ts"])] = bar
                state.last_error = None
            except BadRequestError as exc:
                state.last_error = exc.message
                await self._publish_event(self._event(bot, "bars_error", {"error": exc.message}))
            except Exception as exc:
                state.last_error = str(exc)
            await asyncio.sleep(self.config.BARS_POLL_INTERVAL_SECONDS)

    async def _on_ws_disconnect(self, bot: BotThreadConfig, stream_name: str, reason: str) -> None:
        await self._publish_event(self._event(bot, "ws_disconnected", {"stream": stream_name, "reason": reason}))

    async def _on_open_live(self, ws: Any) -> Optional[asyncio.Task]:
        await ws.send(json.dumps(LIVE_SUB_MESSAGE, ensure_ascii=False))
        return None

    async def _on_open_price(self, ws: Any) -> Optional[asyncio.Task]:
        async def ping_loop():
            while True:
                await asyncio.sleep(30)
                await ws.send(json.dumps(PRICE_PING_MESSAGE, ensure_ascii=False))

        return asyncio.create_task(ping_loop())

    async def _on_live_bars_message(self, bot: BotThreadConfig, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
            bar = self._extract_bar(payload)
            if bar:
                state.bars_by_ts[int(bar["ts"])] = bar
                await self._publish_event(self._event(bot, "live-bars", bar))
        except Exception:
            return

    async def _on_price_message(self, bot: BotThreadConfig, user: UserContext, raw: str, state: RuntimeState, session: requests.Session) -> None:
        price = self._extract_price(raw)
        if price is None:
            return
        state.latest_price = price
        await self._publish_event(self._event(bot, "price", {"price": price, "symbol": self.config.BARS_SYMBOL}))
        if bot.run_mode == "simulator":
            try:
                await asyncio.to_thread(self.execution_client.price_tick, session=session, mobile=user.mobile, price=price, symbol=self.config.BARS_SYMBOL)
            except Exception as exc:
                await self._publish_event(self._event(bot, "simulator_price_error", {"error": str(exc)}))

    async def _on_external_price_message(self, bot: BotThreadConfig, raw: str, state: RuntimeState) -> None:
        price = self._extract_price(raw)
        if price is None:
            return
        state.external_price = price
        await self._publish_event(self._event(bot, "external-price", {"price": price}))

    async def _on_wall_message(self, bot: BotThreadConfig, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
        except Exception:
            return
        if isinstance(payload, dict):
            state.latest_wall = payload
            await self._publish_event(self._event(bot, "wall", payload))

    def _extract_bar(self, payload: dict[str, Any]) -> Optional[dict[str, float]]:
        if all(k in payload for k in ["ts", "open", "high", "low", "close"]):
            return {"ts": int(payload["ts"]), "open": float(payload["open"]), "high": float(payload["high"]), "low": float(payload["low"]), "close": float(payload["close"])}
        data = payload.get("data")
        if isinstance(data, dict) and all(k in data for k in ["ts", "open", "high", "low", "close"]):
            return {"ts": int(data["ts"]), "open": float(data["open"]), "high": float(data["high"]), "low": float(data["low"]), "close": float(data["close"])}
        return None

    def _extract_price(self, raw: str) -> Optional[float]:
        try:
            payload = json.loads(raw)
        except Exception:
            return None
        price = payload.get("price")
        if price is None and isinstance(payload.get("data"), dict):
            price = payload["data"].get("price")
        if price is None:
            return None
        try:
            return float(price)
        except Exception:
            return None
