from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Any, Optional

import requests

from config import Config
from workers.common_json_store import JsonCacheStore
from .clients import normalize_domain_key, normalize_mobile


def _key(domain: str, mobile: str) -> str:
    return f"{normalize_domain_key(domain)}:{normalize_mobile(mobile)}"


@dataclass
class TradingSessionService:
    config: Config

    def __post_init__(self):
        self.sessions = JsonCacheStore(self.config.SESSION_CACHE_FILE)
        self.state = JsonCacheStore(self.config.BOT_STATE_FILE)

    def _load_session(self, mobile: str, base_domain: str) -> dict[str, Any]:
        data = self.sessions.get(_key(base_domain, mobile))
        if not isinstance(data, dict):
            raise ValueError("No session found for user. login first.")
        cookies = data.get("cookies") or {}
        headers = data.get("headers") or {}
        return {"cookies": cookies, "headers": headers}

    def room_status(self, mobile: str, base_domain: str, market: str) -> dict[str, Any]:
        session = self._load_session(mobile, base_domain)
        url = f"{base_domain.rstrip('/')}/{market}/api/status/"
        resp = requests.get(url, cookies=session['cookies'], headers=session['headers'], timeout=20)
        if resp.status_code == 200:
            payload = resp.json()
            return {"success": True, "market": market, "is_open": bool(payload.get('is_open', True)), "active": payload.get('active', True), "reason": payload.get('reason')}
        return {"success": False, "market": market, "is_open": False, "reason": resp.text}

    def _post(self, mobile: str, base_domain: str, room_prefix: str, path: str, payload: Optional[dict] = None):
        session = self._load_session(mobile, base_domain)
        url = f"{base_domain.rstrip('/')}{room_prefix}{path}"
        r = requests.post(url, json=payload or {}, cookies=session['cookies'], headers=session['headers'], timeout=20)
        r.raise_for_status()
        return r.json()

    def _get(self, mobile: str, base_domain: str, room_prefix: str, path: str):
        session = self._load_session(mobile, base_domain)
        url = f"{base_domain.rstrip('/')}{room_prefix}{path}"
        r = requests.get(url, cookies=session['cookies'], headers=session['headers'], timeout=20)
        r.raise_for_status()
        return r.json()

    def bot_activate(self, payload: dict[str, Any]) -> dict[str, Any]:
        required = ["mobile", "room", "strategy"]
        for item in required:
            if item not in payload:
                return {"success": False, "error": f"{item} is required"}
        state = {
            "mobile": payload["mobile"],
            "room": payload["room"],
            "strategy": payload["strategy"],
            "simulation": bool(payload.get("simulation", True)),
            "units": float(payload.get("units", 1)),
            "helper_move_threshold": 1.5,
            "random_limit_tolerance": [0, 5],
            "random_stop_tolerance": [0, 2],
        }
        key = f"bot:{payload['mobile']}:{payload['room']}"
        self.state.set(key, state)
        return {"success": True, "bot": state}

    def cleanup_state(self, mobile: str, base_domain: str) -> dict[str, Any]:
        removed = self.sessions.delete_many([_key(base_domain, mobile)])
        # remove bot keys lazily by known patterns in single file
        data = self.state._read_all()
        bot_keys = [k for k in data if k.startswith(f"bot:{mobile}:")]
        removed += self.state.delete_many(bot_keys)
        return {"success": True, "removed": removed}

    def build_signal_from_helper_move(self, helper_price_before: float, helper_price_now: float, hivagold_price: float) -> dict[str, Any]:
        change = helper_price_now - helper_price_before
        if abs(change) < 1.5:
            return {"should_trade": False, "change": change}
        side = "buy" if change > 0 else "sell"
        tolerance = random.uniform(0, 5)
        order_price = hivagold_price + tolerance if side == "buy" else hivagold_price - tolerance
        return {
            "should_trade": True,
            "side": side,
            "price": round(order_price, 2),
            "stop_loss": round(hivagold_price, 2),
            "helper_change": round(change, 4),
            "strategy": "helper_momentum_v1",
        }
