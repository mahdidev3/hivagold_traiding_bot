import asyncio
import hashlib
import json
import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional
from urllib.parse import urlparse
from uuid import uuid4

import requests

from .strategies import SimplePositionTestStrategy, StrategySignal


@dataclass
class StrategySpec:
    name: str
    description: str


@dataclass
class BotThreadConfig:
    user_id: str
    portfolio_id: str
    market: str
    mobile: str
    password: str
    domain: str
    strategy: str = "simple_position_test_v1"
    task_id: Optional[str] = None
    simulator_task_id: Optional[str] = None
    metadata: dict[str, Any] = field(default_factory=dict)
    active: bool = False


class TradingWorkerService:
    def __init__(
        self, config: Any, session_store: Any, market_client: Any, exec_client: Any
    ):
        self.config = config
        self.session_store = session_store
        self.market_client = market_client
        self.exec_client = exec_client
        self.logger = logging.getLogger(__name__)
        self._lock = asyncio.Lock()
        self._bot_tasks: dict[str, asyncio.Task] = {}
        self._bot_configs: dict[str, BotThreadConfig] = {}
        self._latest_events: dict[str, dict[str, Any]] = {}
        self._task_logs: dict[str, list[dict[str, Any]]] = {}

    def _now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _new_bot_id(self) -> str:
        return f"bot-{uuid4().hex[:10]}"

    def _task_key(self, bot: BotThreadConfig) -> str:
        return f"{bot.portfolio_id}|{bot.market.lower()}|{bot.strategy}|{bot.user_id}"

    def _task_id_from_key(self, task_key: str) -> str:
        digest = hashlib.sha256(task_key.encode("utf-8")).hexdigest()[:16]
        return f"task-{digest}"

    def _normalize_domain(self, domain: str) -> str:
        parsed = urlparse(domain if "://" in domain else f"https://{domain}")
        return f"{parsed.scheme}://{parsed.netloc}"

    def _resolve_strategy(self, bot: BotThreadConfig) -> StrategySpec:
        strategies = {
            "simple_position_test_v1": StrategySpec(
                name="simple_position_test_v1",
                description="create one market buy position for simulator test",
            ),
            "ema_wall_v1": StrategySpec(name="ema_wall_v1", description="placeholder"),
        }
        return strategies.get(
            bot.strategy, StrategySpec(name=bot.strategy, description="custom")
        )

    def _ws_urls(self, domain: str, bot: BotThreadConfig) -> dict[str, str]:
        streams = (
            bot.metadata.get("ws_streams") if isinstance(bot.metadata, dict) else None
        )
        if not streams:
            streams = ["price", "live-bars", "wall"]
        base = self._normalize_domain(domain)
        market = bot.market.lower()
        scheme = "wss" if base.startswith("https://") else "ws"
        host = base.split("://", 1)[1]
        urls: dict[str, str] = {}
        if "price" in streams:
            urls["price"] = f"{scheme}://{host}/{market}/ws/{market}/price/"
        if "live-bars" in streams:
            urls["live-bars"] = f"{scheme}://{host}/{market}/ws/{market}/live-bars/"
        if "wall" in streams:
            urls["wall"] = f"{scheme}://{host}/{market}/ws/{market}/wall/"
        if "external-price" in streams:
            external = bot.metadata.get("external_price_ws") or getattr(
                self.config, "WS_EXTERNAL_PRICE_URL", ""
            )
            if external:
                urls["external-price"] = external
        return urls

    async def _publish_event(self, event: dict[str, Any]) -> None:
        key = f"{event.get('domain', '')}|{event.get('mobile', '')}|{event.get('event', '')}"
        self._latest_events[key] = event

    async def _append_log(
        self,
        task_id: str,
        level: str,
        message: str,
        extra: Optional[dict[str, Any]] = None,
    ) -> None:
        log = {
            "time": self._now(),
            "level": level,
            "message": message,
            "extra": extra or {},
        }
        self._task_logs.setdefault(task_id, []).append(log)

    async def _on_ws_disconnect(
        self, bot: BotThreadConfig, stream: str, reason: str
    ) -> None:
        await self._append_log(
            bot.task_id or "",
            "warning",
            f"ws disconnected: {stream}",
            {"reason": reason},
        )
        await self._publish_event(
            {
                "domain": bot.domain,
                "mobile": bot.mobile,
                "event": "ws_disconnected",
                "payload": {
                    "stream": stream,
                    "reason": reason,
                    "task_id": bot.task_id,
                    "bot_id": self._bot_id_for(bot),
                },
            }
        )

    def _bot_id_for(self, bot: BotThreadConfig) -> Optional[str]:
        for bot_id, cfg in self._bot_configs.items():
            if cfg is bot:
                return bot_id
        return None

    async def _create_position_for_test_strategy(
        self, bot: BotThreadConfig
    ) -> Optional[dict[str, Any]]:
        task_id = bot.simulator_task_id or bot.task_id
        if not task_id:
            return None
        payload = {
            "strategy": "test",
            "side": bot.metadata.get("side", "buy"),
            "entry_type": "market",
            "units": float(bot.metadata.get("units", 0.1)),
            "take_profit": float(bot.metadata.get("take_profit", 2600.0)),
            "stop_loss": float(bot.metadata.get("stop_loss", 2400.0)),
        }
        simulator_url = bot.metadata.get("simulator_url", "http://localhost:8007")
        url = f"{simulator_url.rstrip('/')}/simulator/tasks/{task_id}/positions"
        body = {"task_id": task_id, **payload}
        result = await asyncio.to_thread(
            requests.post,
            url,
            json=body,
            timeout=15,
            headers={"x-api-key": "change-me"},
        )
        result.raise_for_status()
        return result.json()

    async def _run_bot(self, bot: BotThreadConfig):
        strategy = self._resolve_strategy(bot)
        await self._append_log(
            bot.task_id or "", "info", "bot started", {"strategy": strategy.name}
        )
        await self._append_log(
            bot.task_id or "", "info", "ws configured", self._ws_urls(bot.domain, bot)
        )

        # per-task auth/session resolution using saved cookies and headers from auth worker
        session = (
            self.session_store.get_session_data(bot.mobile, bot.domain)
            if self.session_store
            else None
        )
        if session:
            await self._append_log(
                bot.task_id or "",
                "info",
                "session loaded for task",
                {"has_cookies": bool(session.get("cookies"))},
            )

        if strategy.name == "simple_position_test_v1":
            try:
                created = await self._create_position_for_test_strategy(bot)
                await self._append_log(
                    bot.task_id or "", "info", "position created", {"response": created}
                )
            except Exception as exc:
                await self._append_log(
                    bot.task_id or "",
                    "error",
                    "failed to create position",
                    {"error": str(exc)},
                )

        while True:
            await asyncio.sleep(2)

    def _task_bot_ids(self, task_id: str) -> list[str]:
        return [
            bot_id
            for bot_id, bot in self._bot_configs.items()
            if bot.task_id == task_id
        ]

    async def process(self, payload: dict[str, Any]) -> dict[str, Any]:
        action = payload.get("action")
        if action == "create_bot":
            return await self._create_bot(payload)
        if action in {"start_bot", "activate_bot"}:
            return await self._set_bot_active(payload, True)
        if action in {"stop_bot", "deactivate_bot"}:
            return await self._set_bot_active(payload, False)
        if action == "remove_bot":
            return await self._remove_bot(payload)
        if action == "status":
            active_bots = [
                self._bot_state(bot_id, bot)
                for bot_id, bot in self._bot_configs.items()
                if bot.active
            ]
            return {
                "success": True,
                "result": {
                    "active_bots": active_bots,
                    "events": list(self._latest_events.values())[-50:],
                },
            }
        if action == "list_bots":
            return {
                "success": True,
                "result": {
                    "bots": [
                        self._bot_state(bot_id, bot)
                        for bot_id, bot in self._bot_configs.items()
                    ]
                },
            }
        if action == "get_task_status":
            task_id = payload.get("task_id")
            bot_ids = self._task_bot_ids(task_id)
            if not bot_ids:
                return {"success": False, "error": "task not found"}
            bots = [self._bot_configs[bid] for bid in bot_ids]
            return {
                "success": True,
                "result": {
                    "task_id": task_id,
                    "bot_count": len(bot_ids),
                    "active_count": sum(1 for b in bots if b.active),
                    "bots": [
                        self._bot_state(bid, self._bot_configs[bid]) for bid in bot_ids
                    ],
                },
            }
        if action == "get_task_logs":
            task_id = payload.get("task_id")
            return {
                "success": True,
                "result": {
                    "task_id": task_id,
                    "logs": self._task_logs.get(task_id, []),
                },
            }
        return {"success": False, "error": f"Unsupported action: {action}"}

    def _bot_state(self, bot_id: str, bot: BotThreadConfig) -> dict[str, Any]:
        return {
            "bot_id": bot_id,
            "task_id": bot.task_id,
            "simulator_task_id": bot.simulator_task_id,
            "user_id": bot.user_id,
            "portfolio_id": bot.portfolio_id,
            "market": bot.market,
            "strategy": bot.strategy,
            "active": bot.active,
            "metadata": bot.metadata,
        }

    async def _create_bot(self, payload: dict[str, Any]) -> dict[str, Any]:
        bot = BotThreadConfig(
            user_id=str(payload.get("user_id", "")).strip(),
            portfolio_id=str(payload.get("portfolio_id", "")).strip(),
            market=str(payload.get("market", "xag")).strip().lower(),
            strategy=str(payload.get("strategy", "simple_position_test_v1")).strip(),
            simulator_task_id=payload.get("simulator_task_id"),
            mobile=str(payload.get("mobile", "")).strip(),
            password=str(payload.get("password", "")).strip(),
            domain=str(
                payload.get("domain")
                or payload.get("base_domain")
                or "https://hivagold.com"
            ).strip(),
            metadata=payload.get("metadata") or {},
        )
        if not all(
            [bot.user_id, bot.portfolio_id, bot.mobile, bot.password, bot.domain]
        ):
            return {"success": False, "error": "missing required fields"}

        task_key = self._task_key(bot)
        bot.task_id = self._task_id_from_key(task_key)

        bot_id = self._new_bot_id()
        async with self._lock:
            self._bot_configs[bot_id] = bot
            await self._append_log(
                bot.task_id,
                "info",
                "bot created",
                {"bot_id": bot_id, "task_key": task_key},
            )
        return {
            "success": True,
            "result": {
                "bot_id": bot_id,
                "task_id": bot.task_id,
                "strategy": bot.strategy,
                "active": bot.active,
            },
        }

    async def _set_bot_active(
        self, payload: dict[str, Any], active: bool
    ) -> dict[str, Any]:
        bot_id = payload.get("bot_id")
        if not bot_id and payload.get("task_id"):
            matches = self._task_bot_ids(payload["task_id"])
            if len(matches) != 1:
                return {"success": False, "error": "task_id is ambiguous; pass bot_id"}
            bot_id = matches[0]
        if bot_id not in self._bot_configs:
            return {"success": False, "error": "bot not found"}

        bot = self._bot_configs[bot_id]
        if active and not bot.active:
            bot.active = True
            self._bot_tasks[bot_id] = asyncio.create_task(
                self._run_bot(bot), name=f"trade-{bot_id}"
            )
        elif not active and bot.active:
            bot.active = False
            task = self._bot_tasks.pop(bot_id, None)
            if task:
                task.cancel()
                try:
                    await task
                except BaseException:
                    pass
        await self._append_log(
            bot.task_id or "",
            "info",
            "bot state changed",
            {"bot_id": bot_id, "active": bot.active},
        )
        return {
            "success": True,
            "result": {
                "bot_id": bot_id,
                "task_id": bot.task_id,
                "strategy": bot.strategy,
                "active": bot.active,
            },
        }

    async def _remove_bot(self, payload: dict[str, Any]) -> dict[str, Any]:
        bot_id = payload.get("bot_id")
        if bot_id not in self._bot_configs:
            return {"success": False, "error": "bot not found"}
        await self._set_bot_active({"bot_id": bot_id}, False)
        bot = self._bot_configs.pop(bot_id)
        await self._append_log(
            bot.task_id or "", "info", "bot removed", {"bot_id": bot_id}
        )
        return {"success": True, "result": {"bot_id": bot_id, "removed": True}}
