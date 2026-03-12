import asyncio
import json
import logging
import math
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
    ):
        self.config = config
        self.redis_client = redis_client
        self.market_client = market_client
        self.logger = logging.getLogger(__name__)

        self._running = False
        self._stop_event = asyncio.Event()
        self._user_tasks: dict[str, asyncio.Task] = {}
        self._latest_signals: dict[str, dict[str, Any]] = {}
        self._listeners: set[asyncio.Queue] = set()

    def _user_key(self, user: UserContext) -> str:
        return f"{normalize_domain(user.domain)}:{normalize_mobile(user.mobile)}"

    def _users_path(self) -> Path:
        path = Path(self.config.USERS_JSON_PATH)
        if path.is_absolute():
            return path
        if path.exists():
            return path.resolve()

        file_path = Path(__file__).resolve()
        search_roots = [
            Path.cwd(),
            file_path.parent.parent,  # bot_trading_worker
            file_path.parent.parent.parent,  # workers
        ]
        search_roots.extend(file_path.parents)
        seen_roots: set[str] = set()
        for root in search_roots:
            root_key = str(root)
            if root_key in seen_roots:
                continue
            seen_roots.add(root_key)
            candidate = (root / path).resolve()
            if candidate.exists():
                return candidate

        # Docker fallback: /app/users.json
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
            if not mobile or not password or not domain:
                continue
            users.append(UserContext(mobile=mobile, password=password, domain=domain))
        return users

    async def start(self) -> dict[str, Any]:
        if self._running:
            return {"started": True, "users": len(self._user_tasks)}

        users = self._load_users()
        self._stop_event = asyncio.Event()
        self._running = True

        for user in users:
            key = self._user_key(user)
            self._user_tasks[key] = asyncio.create_task(self._run_user(user), name=key)

        return {"started": True, "users": len(self._user_tasks)}

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
            return {
                "success": True,
                "result": {
                    "running": self._running,
                    "users": len(self._user_tasks),
                    "signals": len(self._latest_signals),
                },
            }
        if action == "latest_signals":
            return {"success": True, "result": {"signals": self.latest_signals()}}

        return {"success": False, "error": f"Unknown action: {action}"}

    async def _publish_signal(self, signal: dict[str, Any]) -> None:
        key = f"{signal.get('domain')}:{signal.get('mobile')}"
        self._latest_signals[key] = signal

        for queue in list(self._listeners):
            try:
                if queue.full():
                    _ = queue.get_nowait()
                queue.put_nowait(signal)
            except Exception:
                self._listeners.discard(queue)

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
                await self._publish_signal(
                    self._error_signal(user, f"runtime_error: {str(exc)}")
                )
                await asyncio.sleep(3)

    async def _run_user_session(self, user: UserContext) -> None:
        session_data = self.redis_client.get_session_data(user.mobile, user.domain)
        if not session_data:
            await self._publish_signal(
                self._error_signal(
                    user, "Session not found in Redis for this mobile/domain"
                )
            )
            await asyncio.sleep(5)
            return
        if not isinstance(session_data, dict):
            await self._publish_signal(
                self._error_signal(user, "Invalid session format in Redis")
            )
            await asyncio.sleep(5)
            return

        cookies = session_data.get("cookies") or {}
        if not isinstance(cookies, dict) or not cookies:
            await self._publish_signal(
                self._error_signal(user, "Cookies are missing in Redis session")
            )
            await asyncio.sleep(5)
            return

        headers = session_data.get("headers") or {}
        if not isinstance(headers, dict):
            headers = {}

        http_session = self.market_client.build_http_session(
            cookies,
            user.domain,
            headers=headers,
        )
        try:
            await asyncio.to_thread(
                self.market_client.warmup, http_session, user.domain
            )
        except BadRequestError as exc:
            await self._publish_signal(
                self._error_signal(user, exc.message, status="bad_request")
            )
            await asyncio.sleep(5)
            return

        state = RuntimeState()
        session_stop_event = asyncio.Event()
        ws_headers = self._build_ws_headers(user.domain, http_session, cookies)
        ws_urls = self._ws_urls(user.domain)

        tasks = [
            asyncio.create_task(
                self._bars_loop(user, http_session, state, session_stop_event)
            ),
            asyncio.create_task(self._signal_loop(user, state, session_stop_event)),
            asyncio.create_task(
                self.market_client.ws_connect(
                    "live-bars",
                    ws_urls["live-bars"],
                    ws_headers,
                    session_stop_event,
                    on_message=lambda msg: self._on_live_bars_message(msg, state),
                    on_open=self._on_open_live,
                )
            ),
            asyncio.create_task(
                self.market_client.ws_connect(
                    "price",
                    ws_urls["price"],
                    ws_headers,
                    session_stop_event,
                    on_message=lambda msg: self._on_price_message(msg, state),
                    on_open=self._on_open_price,
                )
            ),
            asyncio.create_task(
                self.market_client.ws_connect(
                    "wall",
                    ws_urls["wall"],
                    ws_headers,
                    session_stop_event,
                    on_message=lambda msg: self._on_wall_message(msg, state),
                )
            ),
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
                except asyncio.CancelledError:
                    pass
                except Exception:
                    pass

    def _build_ws_headers(
        self,
        domain: str,
        session: requests.Session,
        cookies: dict[str, str],
    ) -> dict[str, str]:
        normalized_domain = normalize_base_url(domain)
        room_prefix = (
            f"/{self.config.ROOM_PREFIX.strip('/')}" if self.config.ROOM_PREFIX else ""
        )
        referer = f"{normalized_domain}{room_prefix}/"
        csrf_token = (
            session.headers.get("X-CSRFToken")
            or session.headers.get("X-Csrftoken")
            or cookies.get("csrftoken", "")
        )
        return {
            "User-Agent": session.headers.get("User-Agent", "Mozilla/5.0"),
            "Cookie": cookie_header(cookies),
            "Referer": referer,
            "Origin": normalized_domain,
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Accept-Language": session.headers.get("Accept-Language", "en-US,en;q=0.9"),
            "X-CSRFToken": csrf_token,
        }

    async def _bars_loop(
        self,
        user: UserContext,
        session: requests.Session,
        state: RuntimeState,
        stop_event: asyncio.Event,
    ) -> None:
        while not stop_event.is_set():
            end_ts = utc_now_ts()
            start_ts = end_ts - self.config.LOOKBACK_SECONDS
            try:
                bars = await asyncio.to_thread(
                    self.market_client.fetch_bars,
                    session,
                    user.domain,
                    self.config.BARS_SYMBOL,
                    self.config.BARS_RESOLUTION,
                    start_ts,
                    end_ts,
                )
                for bar in bars:
                    state.bars_by_ts[int(bar["ts"])] = bar
                if len(state.bars_by_ts) > 5000:
                    for ts in sorted(state.bars_by_ts.keys())[:-2500]:
                        state.bars_by_ts.pop(ts, None)
                state.last_error = None
            except BadRequestError as exc:
                state.last_error = exc.message
                await self._publish_signal(
                    self._error_signal(user, exc.message, status="bad_request")
                )
            except Exception as exc:
                state.last_error = str(exc)
            await asyncio.sleep(self.config.BARS_POLL_INTERVAL_SECONDS)

    async def _signal_loop(
        self,
        user: UserContext,
        state: RuntimeState,
        stop_event: asyncio.Event,
    ) -> None:
        while not stop_event.is_set():
            signal = self._build_signal(user, state)
            state.latest_signal = signal
            await self._publish_signal(signal)
            await asyncio.sleep(self.config.SIGNAL_INTERVAL_SECONDS)

    async def _on_open_live(self, ws) -> Optional[asyncio.Task]:
        await ws.send(json.dumps(LIVE_SUB_MESSAGE, ensure_ascii=False))
        return None

    async def _on_open_price(self, ws) -> Optional[asyncio.Task]:
        async def ping_loop():
            while True:
                await asyncio.sleep(30)
                await ws.send(json.dumps(PRICE_PING_MESSAGE, ensure_ascii=False))

        return asyncio.create_task(ping_loop())

    async def _on_live_bars_message(self, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
        except Exception:
            return
        bar = self._extract_bar(payload)
        if bar:
            state.bars_by_ts[int(bar["ts"])] = bar

    async def _on_price_message(self, raw: str, state: RuntimeState) -> None:
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

    async def _on_wall_message(self, raw: str, state: RuntimeState) -> None:
        try:
            payload = json.loads(raw)
        except Exception:
            return
        if isinstance(payload, dict):
            state.latest_wall = payload

    def _extract_bar(self, payload: dict[str, Any]) -> Optional[dict[str, float]]:
        if all(k in payload for k in ["ts", "open", "high", "low", "close"]):
            return {
                "ts": int(payload["ts"]),
                "open": float(payload["open"]),
                "high": float(payload["high"]),
                "low": float(payload["low"]),
                "close": float(payload["close"]),
            }

        data = payload.get("data")
        if isinstance(data, dict) and all(
            k in data for k in ["ts", "open", "high", "low", "close"]
        ):
            return {
                "ts": int(data["ts"]),
                "open": float(data["open"]),
                "high": float(data["high"]),
                "low": float(data["low"]),
                "close": float(data["close"]),
            }

        return None

    def _build_signal(self, user: UserContext, state: RuntimeState) -> dict[str, Any]:
        normalized_mobile = normalize_mobile(user.mobile)
        normalized_domain = normalize_domain(user.domain)
        bars = [state.bars_by_ts[k] for k in sorted(state.bars_by_ts.keys())]
        if len(bars) < 30:
            return self._error_signal(user, "Waiting for enough market bars")

        closes = [bar["close"] for bar in bars]
        highs = [bar["high"] for bar in bars]
        lows = [bar["low"] for bar in bars]

        now_price = state.latest_price if state.latest_price is not None else closes[-1]
        ema9 = self._ema(closes, 9)
        ema21 = self._ema(closes, 21)
        ema50 = self._ema(closes, 50)
        atr14 = self._atr(highs, lows, closes, 14)

        wall = self._wall_features(state.latest_wall)
        spread = wall.get("spread")
        if spread is None or spread <= 0:
            spread = max(atr14 * 0.15 if atr14 > 0 else 0.5, 0.1)

        score, reasons = self._score(now_price, ema9, ema21, ema50, closes, wall)
        confidence = min(abs(score) / 4.0, 1.0)

        bias = "neutral"
        if score >= 1.8:
            bias = "bullish"
        elif score <= -1.8:
            bias = "bearish"

        recommendation = None
        status = "hold"
        if bias in {"bullish", "bearish"}:
            action = "buy" if bias == "bullish" else "sell"
            ordertype = "limit" if confidence >= 0.6 else "verbal"

            price = None
            if ordertype == "limit":
                direction = -1 if action == "buy" else 1
                price = round(
                    now_price
                    + direction * spread * self.config.LIMIT_ORDER_SPREAD_FACTOR,
                    2,
                )

            stop_loss_seconds = int(90 + (1.0 - confidence) * 120)
            take_profit_seconds = int(180 + confidence * 300)

            recommendation = {
                "action": action,
                "ordertype": ordertype,
                "price": price,
                "units": self.config.DEFAULT_UNITS,
                "stop_loss": stop_loss_seconds,
                "take_profit": take_profit_seconds,
            }
            status = "signal"

        return {
            "ts": utc_now_ts(),
            "mobile": normalized_mobile,
            "domain": normalized_domain,
            "status": status,
            "bias": bias,
            "score": round(score, 3),
            "confidence": round(confidence, 3),
            "reasons": reasons,
            "recommendation": recommendation,
            "metrics": {
                "now_price": round(now_price, 5),
                "ema9": round(ema9, 5),
                "ema21": round(ema21, 5),
                "ema50": round(ema50, 5),
                "atr14": round(atr14, 5),
                "spread": round(float(spread), 5),
                "imbalance": wall.get("imbalance"),
            },
            "error": state.last_error,
        }

    def _error_signal(
        self, user: UserContext, error: str, status: str = "error"
    ) -> dict[str, Any]:
        normalized_mobile = normalize_mobile(user.mobile)
        normalized_domain = normalize_domain(user.domain)
        return {
            "ts": utc_now_ts(),
            "mobile": normalized_mobile,
            "domain": normalized_domain,
            "status": status,
            "bias": "neutral",
            "score": 0.0,
            "confidence": 0.0,
            "reasons": [],
            "recommendation": None,
            "metrics": {},
            "error": error,
        }

    def _ema(self, values: list[float], period: int) -> float:
        if not values:
            return 0.0
        alpha = 2.0 / (period + 1.0)
        ema_value = values[0]
        for value in values[1:]:
            ema_value = (value * alpha) + (ema_value * (1.0 - alpha))
        return float(ema_value)

    def _atr(
        self,
        highs: list[float],
        lows: list[float],
        closes: list[float],
        period: int,
    ) -> float:
        if len(highs) < 2 or len(lows) < 2 or len(closes) < 2:
            return 0.0
        trs: list[float] = []
        for idx in range(1, len(closes)):
            high = highs[idx]
            low = lows[idx]
            prev_close = closes[idx - 1]
            tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
            trs.append(tr)
        if not trs:
            return 0.0
        use = trs[-period:] if len(trs) >= period else trs
        return float(sum(use) / len(use))

    def _wall_features(
        self, wall: Optional[dict[str, Any]]
    ) -> dict[str, Optional[float]]:
        if not wall:
            return {"imbalance": None, "spread": None, "microprice": None}

        buys = wall.get("buy") or wall.get("bids") or []
        sells = wall.get("sell") or wall.get("asks") or []
        if not buys or not sells:
            return {"imbalance": None, "spread": None, "microprice": None}

        try:
            best_bid = max(float(item["price"]) for item in buys)
            best_ask = min(float(item["price"]) for item in sells)
            bid_volume_sum = float(sum(float(item["volume"]) for item in buys))
            ask_volume_sum = float(sum(float(item["volume"]) for item in sells))
            denom = bid_volume_sum + ask_volume_sum
            imbalance = (bid_volume_sum - ask_volume_sum) / denom if denom else 0.0

            best_bid_item = max(buys, key=lambda item: float(item["price"]))
            best_ask_item = min(sells, key=lambda item: float(item["price"]))
            bid_px = float(best_bid_item["price"])
            bid_sz = float(best_bid_item["volume"])
            ask_px = float(best_ask_item["price"])
            ask_sz = float(best_ask_item["volume"])
            microprice = ((ask_px * bid_sz) + (bid_px * ask_sz)) / (bid_sz + ask_sz)

            return {
                "imbalance": imbalance,
                "spread": best_ask - best_bid,
                "microprice": microprice,
            }
        except Exception:
            return {"imbalance": None, "spread": None, "microprice": None}

    def _score(
        self,
        now_price: float,
        ema9: float,
        ema21: float,
        ema50: float,
        closes: list[float],
        wall: dict[str, Optional[float]],
    ) -> tuple[float, list[str]]:
        score = 0.0
        reasons: list[str] = []

        if now_price > ema9 > ema21:
            score += 1.4
            reasons.append("price > ema9 > ema21")
        elif now_price < ema9 < ema21:
            score -= 1.4
            reasons.append("price < ema9 < ema21")

        if ema21 > ema50:
            score += 0.8
            reasons.append("ema21 > ema50")
        else:
            score -= 0.8
            reasons.append("ema21 <= ema50")

        momentum = (
            closes[-1] - closes[-5] if len(closes) >= 5 else closes[-1] - closes[0]
        )
        if momentum > 0:
            score += 0.7
            reasons.append("momentum positive")
        elif momentum < 0:
            score -= 0.7
            reasons.append("momentum negative")

        imbalance = wall.get("imbalance")
        if imbalance is not None:
            if imbalance > 0.15:
                score += 0.9
                reasons.append("bid imbalance")
            elif imbalance < -0.15:
                score -= 0.9
                reasons.append("ask imbalance")

        microprice = wall.get("microprice")
        if microprice is not None:
            if microprice > now_price:
                score += 0.4
                reasons.append("microprice above last")
            elif microprice < now_price:
                score -= 0.4
                reasons.append("microprice below last")

        if math.isfinite(score):
            return score, reasons
        return 0.0, reasons
