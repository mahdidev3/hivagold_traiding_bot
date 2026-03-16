import asyncio
import hashlib
import json
import logging
from dataclasses import dataclass, field
from pathlib import Path
from uuid import uuid4
from typing import Any, Dict, Optional
from urllib.parse import urlparse

import requests

from config import Config
from .clients import BadRequestError, MarketDataClient, SessionStore, TradingExecutionClient, UserContext, cookie_header, normalize_base_url, normalize_domain, normalize_mobile, utc_now_ts
from .modules import EmaWallStrategyModule, MarketSnapshot, StrategyAction, StrategyContext

LIVE_SUB_MESSAGE = {"action": "SubAdd", "subs": ["0~hivagold~xag~gold"]}
PRICE_PING_MESSAGE = {"type": "ping"}
MAX_BARS_BUFFER = 600


@dataclass
class RuntimeState:
    bars_by_ts: dict[int, dict[str, float]] = field(default_factory=dict)
    latest_price: Optional[float] = None
    latest_wall: Optional[dict[str, Any]] = None
    external_price: Optional[float] = None
    last_error: Optional[str] = None
    open_orders: list[dict[str, Any]] = field(default_factory=list)


@dataclass
class BotThreadConfig:
    user_id: str
    portfolio_id: str
    market: str
    strategy: str = "pending"
    simulator_task_id: Optional[str] = None
    mobile: str = ""
    password: str = ""
    domain: str = ""
    run_mode: str = "simulator"
    active: bool = True
    task_id: str = ""
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
        self._task_logs: dict[str, list[dict[str, Any]]] = {}
        self._strategies: dict[str, Any] = {EmaWallStrategyModule.name: EmaWallStrategyModule(config)}
        self._bots_cache_mtime: float | None = None
        self._bots_cache: list[BotThreadConfig] = []

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
        users_path = self._users_path()
        if not users_path.exists():
            self.logger.info("Users config file not found: %s", users_path)
            return []
        stat = users_path.stat()
        if self._bots_cache_mtime == stat.st_mtime:
            return [BotThreadConfig(**bot.__dict__) for bot in self._bots_cache]
        try:
            data = json.loads(users_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            self.logger.warning("Invalid users config JSON in %s", users_path)
            return []
        if not isinstance(data, list):
            self.logger.warning("Users config root is not a list in %s", users_path)
            return []
        bots: list[BotThreadConfig] = []
        for item in data:
            if not isinstance(item, dict):
                continue
            bot = BotThreadConfig(
                user_id=str(item.get("user_id", item.get("mobile", ""))).strip(),
                portfolio_id=str(item.get("portfolio_id", item.get("metadata", {}).get("portfolio_id", ""))).strip(),
                market=str(item.get("market", item.get("room", "xag"))).strip() or "xag",
                strategy=str(item.get("strategy", "pending")).strip() or "pending",
                simulator_task_id=str(item.get("simulator_task_id", "")).strip() or None,
                mobile=normalize_mobile(str(item.get("mobile", "")).strip()),
                password=str(item.get("password", "")).strip(),
                domain=str(item.get("domain", "")).strip(),
                run_mode=str(item.get("run_mode", "simulator")).strip() or "simulator",
                active=bool(item.get("active", True)),
                task_id=str(item.get("task_id", "")).strip(),
                metadata=item.get("metadata") if isinstance(item.get("metadata"), dict) else {},
            )
            if not bot.task_id:
                bot.task_id = self._build_task_id(bot.portfolio_id, bot.market, bot.strategy, bot.user_id)
            if bot.user_id and bot.portfolio_id and bot.market:
                bots.append(bot)
        self._bots_cache_mtime = stat.st_mtime
        self._bots_cache = [BotThreadConfig(**bot.__dict__) for bot in bots]
        return bots

    async def start(self) -> dict[str, Any]:
        if self._running:
            return {"started": True, "bots": len(self._user_tasks)}
        self._stop_event = asyncio.Event()
        self._running = True
        for bot in self._load_bots():
            bot_id = self._new_bot_id()
            self._bot_configs[bot_id] = bot
            if bot.active:
                self._ensure_bot_active(bot_id, bot)
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

    def _new_bot_id(self) -> str:
        return f"bot-{uuid4().hex[:12]}"

    async def process(self, args: Dict[str, Any]) -> Dict[str, Any]:
        action = args.get("action")
        if action == "create_bot":
            return await self._create_bot(args)
        if action == "remove_bot":
            return await self._remove_bot(args)
        if action == "start_bot":
            return await self._toggle_bot(args, activate=True)
        if action == "stop_bot":
            return await self._toggle_bot(args, activate=False)
        if action == "start":
            return {"success": True, "result": await self.start()}
        if action == "stop":
            return {"success": True, "result": await self.stop()}
        if action == "status":
            return {"success": True, "result": {"running": self._running, "active_bots": [self._active_bot_info(key) for key in self._user_tasks], "configured_bots": len(self._bot_configs)}}
        if action == "list_bots":
            return {"success": True, "result": {"bots": [self._bot_to_dict(cfg) | {"bot_id": bot_id} for bot_id, cfg in self._bot_configs.items()]}}
        if action == "activate_bot":
            return await self._toggle_bot(args, activate=True)
        if action == "deactivate_bot":
            return await self._toggle_bot(args, activate=False)
        if action == "get_task_status":
            return self._get_task_status(args)
        if action == "get_task_logs":
            return self._get_task_logs(args)
        return {"success": False, "error": f"Unknown action: {action}"}

    async def _create_bot(self, args: Dict[str, Any]) -> Dict[str, Any]:
        user_id = str(args.get("user_id", args.get("mobile", ""))).strip()
        portfolio_id = str(args.get("portfolio_id", "")).strip()
        market = str(args.get("market", args.get("room", ""))).strip()
        strategy = str(args.get("strategy", "pending")).strip() or "pending"
        if not user_id or not portfolio_id or not market or not strategy:
            return {"success": False, "error": "user_id, portfolio_id, market and strategy are required"}

        task_id = self._build_task_id(portfolio_id, market, strategy, user_id)

        bot = BotThreadConfig(
            user_id=user_id,
            portfolio_id=portfolio_id,
            market=market,
            strategy=strategy,
            simulator_task_id=str(args.get("simulator_task_id", "")).strip() or None,
            mobile=normalize_mobile(str(args.get("mobile", "")).strip()),
            password=str(args.get("password", "")).strip(),
            domain=str(args.get("domain", "")).strip(),
            run_mode=str(args.get("run_mode", "simulator")).strip() or "simulator",
            active=bool(args.get("active", False)),
            task_id=task_id,
            metadata=args.get("metadata") if isinstance(args.get("metadata"), dict) else {},
        )
        bot_id = self._new_bot_id()
        self._bot_configs[bot_id] = bot
        if bot.active:
            self._ensure_bot_active(bot_id, bot)
        return {"success": True, "result": self._bot_to_dict(bot) | {"bot_id": bot_id}}

    async def _remove_bot(self, args: Dict[str, Any]) -> Dict[str, Any]:
        bot_id = self._resolve_bot_id(args)
        if not bot_id:
            return {"success": False, "error": "Bot not found"}
        bot = self._bot_configs.pop(bot_id, None)
        if not bot:
            return {"success": False, "error": "Bot not found"}
        task = self._user_tasks.pop(bot_id, None)
        if task:
            task.cancel()
        return {
            "success": True,
            "result": {"removed": True, "bot_id": bot_id, "mobile": bot.mobile, "domain": bot.domain},
        }

    def _build_task_id(self, portfolio_id: str, market: str, strategy: str, user_id: str) -> str:
        task_key = f"{portfolio_id}|{market}|{strategy}|{user_id}".lower().strip()
        digest = hashlib.sha1(task_key.encode("utf-8")).hexdigest()[:16]
        return f"task-{digest}"

    def _get_task_status(self, args: Dict[str, Any]) -> Dict[str, Any]:
        task_id = str(args.get("task_id", "")).strip()
        if not task_id:
            return {"success": False, "error": "task_id is required"}
        bots = [
            self._bot_to_dict(cfg) | {"bot_id": bot_id}
            for bot_id, cfg in self._bot_configs.items()
            if cfg.task_id == task_id
        ]
        if not bots:
            return {"success": False, "error": "Task not found"}
        active_bot_ids = [bot["bot_id"] for bot in bots if bot["bot_id"] in self._user_tasks]
        return {"success": True, "result": {"task_id": task_id, "bot_count": len(bots), "active_bot_ids": active_bot_ids, "bots": bots}}

    def _get_task_logs(self, args: Dict[str, Any]) -> Dict[str, Any]:
        task_id = str(args.get("task_id", "")).strip()
        if not task_id:
            return {"success": False, "error": "task_id is required"}
        return {"success": True, "result": {"task_id": task_id, "logs": self._task_logs.get(task_id, [])}}

    async def _toggle_bot(self, args: Dict[str, Any], activate: bool) -> Dict[str, Any]:
        bot_id = self._resolve_bot_id(args)
        if not bot_id:
            return {"success": False, "error": "Bot not found"}
        bot = self._bot_configs.get(bot_id)
        if not bot:
            return {"success": False, "error": "Bot not found"}

        bot.active = activate
        if activate:
            self._ensure_bot_active(bot_id, bot)
        else:
            task = self._user_tasks.pop(bot_id, None)
            if task:
                task.cancel()

        return {"success": True, "result": {"bot_id": bot_id, "mobile": bot.mobile, "domain": bot.domain, "strategy": bot.strategy, "active": bot.active}}

    def _resolve_bot_id(self, args: Dict[str, Any]) -> Optional[str]:
        bot_id = str(args.get("bot_id", "")).strip()
        if bot_id:
            return bot_id if bot_id in self._bot_configs else None
        mobile = str(args.get("mobile", "")).strip()
        domain = str(args.get("domain", "")).strip()
        strategy = str(args.get("strategy", "")).strip()
        market = str(args.get("market", args.get("room", "")).strip())
        run_mode = str(args.get("run_mode", "")).strip()
        task_id = str(args.get("task_id", "")).strip()
        if task_id:
            matches = [candidate_id for candidate_id, bot in self._bot_configs.items() if bot.task_id == task_id]
            return matches[0] if len(matches) == 1 else None
        if not (mobile and domain):
            return None
        matches: list[str] = []
        mobile_normalized = normalize_mobile(mobile)
        domain_normalized = normalize_domain(domain)
        for candidate_id, bot in self._bot_configs.items():
            if normalize_mobile(bot.mobile) != mobile_normalized:
                continue
            if normalize_domain(bot.domain) != domain_normalized:
                continue
            if strategy and bot.strategy != strategy:
                continue
            if market and bot.market != market:
                continue
            if run_mode and bot.run_mode != run_mode:
                continue
            matches.append(candidate_id)
        if len(matches) == 1:
            return matches[0]
        return None

    def _ensure_bot_active(self, bot_id: str, bot: BotThreadConfig) -> str:
        if bot_id not in self._user_tasks:
            self._user_tasks[bot_id] = asyncio.create_task(self._run_bot(bot), name=bot_id)
        return bot_id

    def _active_bot_info(self, key: str) -> dict[str, Any]:
        bot = self._bot_configs.get(key)
        if not bot:
            return {"bot_id": key}
        return {
            "bot_id": key,
            "mobile": bot.mobile,
            "user_id": bot.user_id,
            "portfolio_id": bot.portfolio_id,
            "market": bot.market,
            "task_id": bot.task_id,
            "simulator_task_id": bot.simulator_task_id,
            "domain": bot.domain,
            "strategy": bot.strategy,
            "run_mode": bot.run_mode,
        }

    def _bot_to_dict(self, bot: BotThreadConfig) -> dict[str, Any]:
        return {
            "user_id": bot.user_id,
            "portfolio_id": bot.portfolio_id,
            "market": bot.market,
            "strategy": bot.strategy,
            "task_id": bot.task_id,
            "simulator_task_id": bot.simulator_task_id,
            "mobile": bot.mobile,
            "domain": bot.domain,
            "run_mode": bot.run_mode,
            "active": bot.active,
            "metadata": bot.metadata,
        }

    async def _publish_event(self, payload: dict[str, Any]) -> None:
        key = f"{payload.get('domain')}:{payload.get('mobile')}:{payload.get('event')}"
        self._latest_events[key] = payload
        task_id = payload.get("task_id")
        if task_id:
            self._task_logs.setdefault(task_id, []).append(payload)
            self._task_logs[task_id] = self._task_logs[task_id][-500:]

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


    def _resolve_strategy(self, bot: BotThreadConfig):
        return self._strategies.get(bot.strategy)

    def _prune_bars(self, state: RuntimeState) -> None:
        if len(state.bars_by_ts) <= MAX_BARS_BUFFER:
            return
        keep_keys = sorted(state.bars_by_ts.keys())[-MAX_BARS_BUFFER:]
        state.bars_by_ts = {k: state.bars_by_ts[k] for k in keep_keys}

    async def _apply_strategy(self, bot: BotThreadConfig, user: UserContext, session: requests.Session, state: RuntimeState) -> None:
        strategy = self._resolve_strategy(bot)
        if strategy is None:
            return
        if len(state.bars_by_ts) < 50 or state.latest_price is None:
            return

        bars = [state.bars_by_ts[k] for k in sorted(state.bars_by_ts.keys())[-200:]]
        snapshot = MarketSnapshot(
            now_ts=utc_now_ts(),
            bars=bars,
            latest_price=state.latest_price,
            latest_wall=state.latest_wall,
            last_error=state.last_error,
        )
        context = StrategyContext(
            mobile=bot.mobile,
            domain=bot.domain,
            room=bot.market,
            run_mode=bot.run_mode,
            portfolio_id=bot.portfolio_id or None,
            open_orders=state.open_orders,
        )
        actions = strategy.on_market_update(snapshot, context)
        if not actions:
            return
        await self._publish_event(self._event(bot, "strategy_actions", {"count": len(actions), "strategy": strategy.name}))
        await self._execute_actions(bot, user, session, actions, state)

    async def _execute_actions(self, bot: BotThreadConfig, user: UserContext, session: requests.Session, actions: list[StrategyAction], state: RuntimeState) -> None:
        for action in actions:
            try:
                result: dict[str, Any]
                if action.operation == "create_order":
                    payload = dict(action.payload)
                    payload.setdefault("user_id", user.mobile)
                    result = await asyncio.to_thread(self.execution_client.create_order, run_mode=bot.run_mode, session=session, domain=user.domain, payload=payload)
                    state.open_orders.append(result.get("result") if isinstance(result.get("result"), dict) else payload)
                elif action.operation == "update_order":
                    order_id = action.payload.get("order_id")
                    if order_id is None:
                        continue
                    payload = {k: v for k, v in action.payload.items() if k not in {"order_id", "mobile", "domain", "room", "strategy", "portfolio_id"}}
                    result = await asyncio.to_thread(self.execution_client.update_order, run_mode=bot.run_mode, session=session, domain=user.domain, order_id=order_id, payload=payload)
                elif action.operation == "close_order":
                    order_id = action.payload.get("order_id")
                    if order_id is None:
                        continue
                    result = await asyncio.to_thread(self.execution_client.close_order, run_mode=bot.run_mode, session=session, domain=user.domain, order_id=order_id, close_price=action.payload.get("close_price"), reason=action.reason)
                    state.open_orders = [o for o in state.open_orders if (o.get("id") or o.get("position_id")) != order_id]
                else:
                    continue
                await self._publish_event(self._event(bot, "strategy_order", {"operation": action.operation, "reason": action.reason, "result": result}))
            except Exception as exc:
                await self._publish_event(self._event(bot, "strategy_order_error", {"operation": action.operation, "error": str(exc)}))

    def _event(self, bot: BotThreadConfig, event: str, payload: dict[str, Any]) -> dict[str, Any]:
        return {
            "ts": utc_now_ts(),
            "task_id": bot.task_id,
            "user_id": bot.user_id,
            "portfolio_id": bot.portfolio_id,
            "market": bot.market,
            "mobile": bot.mobile,
            "domain": normalize_domain(bot.domain) if bot.domain else "",
            "strategy": bot.strategy,
            "run_mode": bot.run_mode,
            "event": event,
            "payload": payload,
        }

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
                self._prune_bars(state)
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
                self._prune_bars(state)
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

        await self._apply_strategy(bot, user, session, state)

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
