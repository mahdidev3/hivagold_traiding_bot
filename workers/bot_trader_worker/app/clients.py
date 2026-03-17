from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, Iterable

import aiohttp


DEFAULT_TIMEOUT = float(os.getenv("SIMULATOR_CLIENT_TIMEOUT", "30"))
DEFAULT_USER_AGENT = os.getenv("SIMULATOR_CLIENT_USER_AGENT", "bot-trader-worker/1.0")


class SimulatorClientError(Exception):
    """Base error for simulator client failures."""


class SimulatorHttpError(SimulatorClientError):
    """HTTP/network level error."""

    def __init__(self, message: str, status_code: int | None = None, payload: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload


class SimulatorApiError(SimulatorClientError):
    """Application level error returned by simulator worker."""

    def __init__(self, message: str, payload: Any = None):
        super().__init__(message)
        self.payload = payload


@dataclass(slots=True)
class SimulatorClientConfig:
    base_url: str
    api_key: str
    timeout: float = DEFAULT_TIMEOUT
    user_agent: str = DEFAULT_USER_AGENT

    @classmethod
    def from_env(cls) -> "SimulatorClientConfig":
        base_url = (
            os.getenv("SIMULATOR_WORKER_BASE_URL")
            or os.getenv("SIMULATOR_BASE_URL")
            or _build_base_url_from_host_port(
                host=os.getenv("SIMULATOR_WORKER_HOST", "127.0.0.1"),
                port=os.getenv("SIMULATOR_WORKER_PORT", "8007"),
                scheme=os.getenv("SIMULATOR_WORKER_SCHEME", "http"),
            )
        )
        api_key = os.getenv("BOT_API_KEY", "change-me")
        timeout = float(os.getenv("SIMULATOR_CLIENT_TIMEOUT", DEFAULT_TIMEOUT))
        user_agent = os.getenv("SIMULATOR_CLIENT_USER_AGENT", DEFAULT_USER_AGENT)
        return cls(
            base_url=_normalize_base_url(base_url),
            api_key=api_key,
            timeout=timeout,
            user_agent=user_agent,
        )


class SimulatorClient:
    """Blocking client for bot_simulator_worker.

    It is suitable for strategy threads and scripts where async I/O is not needed.
    """

    def __init__(
        self,
        base_url: str | None = None,
        api_key: str | None = None,
        *,
        timeout: float | None = None,
        user_agent: str | None = None,
        config: SimulatorClientConfig | None = None,
    ) -> None:
        config = config or SimulatorClientConfig.from_env()
        self.base_url = _normalize_base_url(base_url or config.base_url)
        self.api_key = api_key or config.api_key
        self.timeout = float(timeout or config.timeout)
        self.user_agent = user_agent or config.user_agent

    @classmethod
    def from_env(cls) -> "SimulatorClient":
        return cls(config=SimulatorClientConfig.from_env())

    def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json_body: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        url = _join_url(self.base_url, path, params=params)
        data = None
        headers = self._headers()

        if json_body is not None:
            data = json.dumps(json_body, ensure_ascii=False).encode("utf-8")
            headers["Content-Type"] = "application/json"

        request = urllib.request.Request(
            url=url,
            method=method.upper(),
            data=data,
            headers=headers,
        )

        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                raw = response.read().decode("utf-8")
                payload = json.loads(raw) if raw else {}
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            parsed = _safe_json_loads(body)
            detail = _extract_error_detail(parsed) or body or str(exc)
            raise SimulatorHttpError(detail, status_code=exc.code, payload=parsed) from exc
        except urllib.error.URLError as exc:
            raise SimulatorHttpError(f"Simulator request failed: {exc.reason}") from exc
        except TimeoutError as exc:
            raise SimulatorHttpError("Simulator request timed out") from exc

        return _unwrap_result(payload)

    def _headers(self) -> dict[str, str]:
        return {
            "Accept": "application/json",
            "User-Agent": self.user_agent,
            "x-api-key": self.api_key,
        }

    # -------------------- low-level endpoints --------------------

    def health(self) -> dict[str, Any]:
        return self.request("GET", "/health")

    def create_task(
        self,
        *,
        portfolio_id: str,
        user_id: str,
        market: str,
        initial_units: float,
        domain: str | None = None,
    ) -> dict[str, Any]:
        payload = {
            "portfolio_id": portfolio_id,
            "user_id": user_id,
            "market": market,
            "initial_units": float(initial_units),
        }
        if domain:
            payload["domain"] = domain
        return self.request("POST", "/simulator/tasks", json_body=payload)

    def close_task(self, task_id: str, *, reason: str = "manual") -> dict[str, Any]:
        return self.request(
            "POST",
            f"/simulator/tasks/{task_id}/close",
            json_body={"reason": reason},
        )

    def get_task_info(self, task_id: str) -> dict[str, Any]:
        return self.request("GET", f"/simulator/tasks/{task_id}")

    def get_db_records(self) -> dict[str, Any]:
        return self.request("GET", "/simulator/db/records")

    def create_position(
        self,
        task_id: str,
        *,
        side: str,
        take_profit: float,
        stop_loss: float,
        units: float = 1.0,
        strategy: str = "manual",
        entry_type: str = "market",
        entry_price: float | None = None,
    ) -> dict[str, Any]:
        payload = {
            "strategy": strategy,
            "side": side,
            "entry_type": entry_type,
            "entry_price": entry_price,
            "take_profit": float(take_profit),
            "stop_loss": float(stop_loss),
            "units": float(units),
        }
        return self.request(
            "POST",
            f"/simulator/tasks/{task_id}/positions",
            json_body=payload,
        )

    def update_position(
        self,
        position_id: str,
        *,
        take_profit: float | None = None,
        stop_loss: float | None = None,
        entry_price: float | None = None,
        units: float | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        if take_profit is not None:
            payload["take_profit"] = float(take_profit)
        if stop_loss is not None:
            payload["stop_loss"] = float(stop_loss)
        if entry_price is not None:
            payload["entry_price"] = float(entry_price)
        if units is not None:
            payload["units"] = float(units)
        return self.request("PATCH", f"/simulator/positions/{position_id}", json_body=payload)

    def change_stop_loss(self, position_id: str, *, stop_loss: float) -> dict[str, Any]:
        return self.request(
            "POST",
            f"/simulator/positions/{position_id}/stop-loss",
            json_body={"stop_loss": float(stop_loss)},
        )

    def close_position(
        self,
        position_id: str,
        *,
        close_price: float | None = None,
        reason: str = "manual",
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {"reason": reason}
        if close_price is not None:
            payload["close_price"] = float(close_price)
        return self.request(
            "POST",
            f"/simulator/positions/{position_id}/close",
            json_body=payload,
        )

    def price_tick(self, task_id: str, *, market: str, price: float) -> dict[str, Any]:
        return self.request(
            "POST",
            "/simulator/price",
            json_body={
                "task_id": task_id,
                "market": market,
                "price": float(price),
            },
        )

    # -------------------- convenience helpers --------------------

    def create_market_position(
        self,
        task_id: str,
        *,
        side: str,
        take_profit: float,
        stop_loss: float,
        units: float = 1.0,
        strategy: str = "manual",
        fallback_entry_price: float | None = None,
    ) -> dict[str, Any]:
        return self.create_position(
            task_id,
            side=side,
            take_profit=take_profit,
            stop_loss=stop_loss,
            units=units,
            strategy=strategy,
            entry_type="market",
            entry_price=fallback_entry_price,
        )

    def create_limit_position(
        self,
        task_id: str,
        *,
        side: str,
        entry_price: float,
        take_profit: float,
        stop_loss: float,
        units: float = 1.0,
        strategy: str = "manual",
    ) -> dict[str, Any]:
        return self.create_position(
            task_id,
            side=side,
            take_profit=take_profit,
            stop_loss=stop_loss,
            units=units,
            strategy=strategy,
            entry_type="limit",
            entry_price=entry_price,
        )

    def create_buy_position(self, task_id: str, **kwargs: Any) -> dict[str, Any]:
        return self.create_position(task_id, side="buy", **kwargs)

    def create_sell_position(self, task_id: str, **kwargs: Any) -> dict[str, Any]:
        return self.create_position(task_id, side="sell", **kwargs)

    def update_take_profit(self, position_id: str, take_profit: float) -> dict[str, Any]:
        return self.update_position(position_id, take_profit=take_profit)

    def update_entry_price(self, position_id: str, entry_price: float) -> dict[str, Any]:
        return self.update_position(position_id, entry_price=entry_price)

    def update_units(self, position_id: str, units: float) -> dict[str, Any]:
        return self.update_position(position_id, units=units)

    def close_position_at_market(self, position_id: str, *, reason: str = "manual") -> dict[str, Any]:
        return self.close_position(position_id, reason=reason)

    def push_price(self, task_id: str, *, market: str, price: float) -> dict[str, Any]:
        return self.price_tick(task_id, market=market, price=price)

    def list_tasks(self) -> list[dict[str, Any]]:
        return list(self.get_db_records().get("tasks", []))

    def list_positions(self) -> list[dict[str, Any]]:
        return list(self.get_db_records().get("positions", []))

    def get_task(self, task_id: str) -> dict[str, Any]:
        info = self.get_task_info(task_id)
        task = info.get("task")
        if not task:
            raise SimulatorApiError(f"Task '{task_id}' not found in simulator response", payload=info)
        return task

    def get_position(self, position_id: str) -> dict[str, Any]:
        for position in self.list_positions():
            if position.get("id") == position_id:
                return position
        raise SimulatorApiError(f"Position '{position_id}' not found")

    def get_positions_for_task(self, task_id: str) -> list[dict[str, Any]]:
        info = self.get_task_info(task_id)
        return list(info.get("positions", []))

    def get_open_tasks(self) -> list[dict[str, Any]]:
        return [task for task in self.list_tasks() if task.get("status") == "open"]

    def get_closed_tasks(self) -> list[dict[str, Any]]:
        return [task for task in self.list_tasks() if task.get("status") == "closed"]

    def get_open_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return self._filter_positions(status="open", task_id=task_id)

    def get_pending_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return self._filter_positions(status="pending", task_id=task_id)

    def get_closed_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return self._filter_positions(status="closed", task_id=task_id)

    def task_exists(self, task_id: str) -> bool:
        try:
            self.get_task(task_id)
            return True
        except SimulatorClientError:
            return False

    def position_exists(self, position_id: str) -> bool:
        try:
            self.get_position(position_id)
            return True
        except SimulatorClientError:
            return False

    def find_task(
        self,
        *,
        portfolio_id: str | None = None,
        user_id: str | None = None,
        market: str | None = None,
        status: str | None = None,
    ) -> list[dict[str, Any]]:
        tasks = self.list_tasks()
        if portfolio_id is not None:
            tasks = [item for item in tasks if item.get("portfolio_id") == portfolio_id]
        if user_id is not None:
            tasks = [item for item in tasks if item.get("user_id") == user_id]
        if market is not None:
            tasks = [item for item in tasks if item.get("market") == market]
        if status is not None:
            tasks = [item for item in tasks if item.get("status") == status]
        return tasks

    def get_task_last_price(self, task_id: str) -> float | None:
        task = self.get_task(task_id)
        last_price = task.get("last_price")
        return float(last_price) if last_price is not None else None

    def summarize_task(self, task_id: str) -> dict[str, Any]:
        info = self.get_task_info(task_id)
        task = info.get("task", {})
        positions = list(info.get("positions", []))

        realized_pnl = sum(
            float(position.get("pnl") or 0)
            for position in positions
            if position.get("status") == "closed"
        )

        return {
            "task": task,
            "positions": positions,
            "count_positions": len(positions),
            "count_open_positions": len([p for p in positions if p.get("status") == "open"]),
            "count_pending_positions": len([p for p in positions if p.get("status") == "pending"]),
            "count_closed_positions": len([p for p in positions if p.get("status") == "closed"]),
            "realized_pnl": round(realized_pnl, 4),
            "available_units": task.get("available_units"),
            "last_price": task.get("last_price"),
        }

    def _filter_positions(self, *, status: str, task_id: str | None = None) -> list[dict[str, Any]]:
        positions: Iterable[dict[str, Any]]
        if task_id is None:
            positions = self.list_positions()
        else:
            positions = self.get_positions_for_task(task_id)
        return [position for position in positions if position.get("status") == status]


class AsyncSimulatorClient:
    """Async client for bot_simulator_worker based on aiohttp."""

    def __init__(
        self,
        base_url: str | None = None,
        api_key: str | None = None,
        *,
        timeout: float | None = None,
        user_agent: str | None = None,
        config: SimulatorClientConfig | None = None,
        session: aiohttp.ClientSession | None = None,
    ) -> None:
        config = config or SimulatorClientConfig.from_env()
        self.base_url = _normalize_base_url(base_url or config.base_url)
        self.api_key = api_key or config.api_key
        self.timeout = float(timeout or config.timeout)
        self.user_agent = user_agent or config.user_agent
        self._session = session
        self._owns_session = session is None

    @classmethod
    def from_env(cls) -> "AsyncSimulatorClient":
        return cls(config=SimulatorClientConfig.from_env())

    async def __aenter__(self) -> "AsyncSimulatorClient":
        await self._ensure_session()
        return self

    async def __aexit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        await self.close()

    async def close(self) -> None:
        if self._owns_session and self._session is not None:
            await self._session.close()
            self._session = None

    async def _ensure_session(self) -> aiohttp.ClientSession:
        if self._session is None:
            timeout = aiohttp.ClientTimeout(total=self.timeout)
            self._session = aiohttp.ClientSession(timeout=timeout, headers=self._headers())
            self._owns_session = True
        return self._session

    def _headers(self) -> dict[str, str]:
        return {
            "Accept": "application/json",
            "User-Agent": self.user_agent,
            "x-api-key": self.api_key,
        }

    async def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        json_body: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        session = await self._ensure_session()
        url = _join_url(self.base_url, path, params=params)

        try:
            async with session.request(method.upper(), url, json=json_body) as response:
                payload = await _read_aiohttp_payload(response)
                if response.status >= 400:
                    detail = _extract_error_detail(payload) or response.reason or "HTTP request failed"
                    raise SimulatorHttpError(detail, status_code=response.status, payload=payload)
        except aiohttp.ClientError as exc:
            raise SimulatorHttpError(f"Simulator request failed: {exc}") from exc
        except TimeoutError as exc:
            raise SimulatorHttpError("Simulator request timed out") from exc

        return _unwrap_result(payload)

    async def health(self) -> dict[str, Any]:
        return await self.request("GET", "/health")

    async def create_task(
        self,
        *,
        portfolio_id: str,
        user_id: str,
        market: str,
        initial_units: float,
        domain: str | None = None,
    ) -> dict[str, Any]:
        payload = {
            "portfolio_id": portfolio_id,
            "user_id": user_id,
            "market": market,
            "initial_units": float(initial_units),
        }
        if domain:
            payload["domain"] = domain
        return await self.request("POST", "/simulator/tasks", json_body=payload)

    async def close_task(self, task_id: str, *, reason: str = "manual") -> dict[str, Any]:
        return await self.request(
            "POST",
            f"/simulator/tasks/{task_id}/close",
            json_body={"reason": reason},
        )

    async def get_task_info(self, task_id: str) -> dict[str, Any]:
        return await self.request("GET", f"/simulator/tasks/{task_id}")

    async def get_db_records(self) -> dict[str, Any]:
        return await self.request("GET", "/simulator/db/records")

    async def create_position(
        self,
        task_id: str,
        *,
        side: str,
        take_profit: float,
        stop_loss: float,
        units: float = 1.0,
        strategy: str = "manual",
        entry_type: str = "market",
        entry_price: float | None = None,
    ) -> dict[str, Any]:
        payload = {
            "strategy": strategy,
            "side": side,
            "entry_type": entry_type,
            "entry_price": entry_price,
            "take_profit": float(take_profit),
            "stop_loss": float(stop_loss),
            "units": float(units),
        }
        return await self.request(
            "POST",
            f"/simulator/tasks/{task_id}/positions",
            json_body=payload,
        )

    async def update_position(
        self,
        position_id: str,
        *,
        take_profit: float | None = None,
        stop_loss: float | None = None,
        entry_price: float | None = None,
        units: float | None = None,
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        if take_profit is not None:
            payload["take_profit"] = float(take_profit)
        if stop_loss is not None:
            payload["stop_loss"] = float(stop_loss)
        if entry_price is not None:
            payload["entry_price"] = float(entry_price)
        if units is not None:
            payload["units"] = float(units)
        return await self.request("PATCH", f"/simulator/positions/{position_id}", json_body=payload)

    async def change_stop_loss(self, position_id: str, *, stop_loss: float) -> dict[str, Any]:
        return await self.request(
            "POST",
            f"/simulator/positions/{position_id}/stop-loss",
            json_body={"stop_loss": float(stop_loss)},
        )

    async def close_position(
        self,
        position_id: str,
        *,
        close_price: float | None = None,
        reason: str = "manual",
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {"reason": reason}
        if close_price is not None:
            payload["close_price"] = float(close_price)
        return await self.request(
            "POST",
            f"/simulator/positions/{position_id}/close",
            json_body=payload,
        )

    async def price_tick(self, task_id: str, *, market: str, price: float) -> dict[str, Any]:
        return await self.request(
            "POST",
            "/simulator/price",
            json_body={
                "task_id": task_id,
                "market": market,
                "price": float(price),
            },
        )

    async def create_market_position(self, task_id: str, **kwargs: Any) -> dict[str, Any]:
        return await self.create_position(task_id, entry_type="market", **kwargs)

    async def create_limit_position(
        self,
        task_id: str,
        *,
        side: str,
        entry_price: float,
        take_profit: float,
        stop_loss: float,
        units: float = 1.0,
        strategy: str = "manual",
    ) -> dict[str, Any]:
        return await self.create_position(
            task_id,
            side=side,
            entry_type="limit",
            entry_price=entry_price,
            take_profit=take_profit,
            stop_loss=stop_loss,
            units=units,
            strategy=strategy,
        )

    async def create_buy_position(self, task_id: str, **kwargs: Any) -> dict[str, Any]:
        return await self.create_position(task_id, side="buy", **kwargs)

    async def create_sell_position(self, task_id: str, **kwargs: Any) -> dict[str, Any]:
        return await self.create_position(task_id, side="sell", **kwargs)

    async def update_take_profit(self, position_id: str, take_profit: float) -> dict[str, Any]:
        return await self.update_position(position_id, take_profit=take_profit)

    async def update_entry_price(self, position_id: str, entry_price: float) -> dict[str, Any]:
        return await self.update_position(position_id, entry_price=entry_price)

    async def update_units(self, position_id: str, units: float) -> dict[str, Any]:
        return await self.update_position(position_id, units=units)

    async def push_price(self, task_id: str, *, market: str, price: float) -> dict[str, Any]:
        return await self.price_tick(task_id, market=market, price=price)

    async def list_tasks(self) -> list[dict[str, Any]]:
        return list((await self.get_db_records()).get("tasks", []))

    async def list_positions(self) -> list[dict[str, Any]]:
        return list((await self.get_db_records()).get("positions", []))

    async def get_task(self, task_id: str) -> dict[str, Any]:
        info = await self.get_task_info(task_id)
        task = info.get("task")
        if not task:
            raise SimulatorApiError(f"Task '{task_id}' not found in simulator response", payload=info)
        return task

    async def get_position(self, position_id: str) -> dict[str, Any]:
        for position in await self.list_positions():
            if position.get("id") == position_id:
                return position
        raise SimulatorApiError(f"Position '{position_id}' not found")

    async def get_positions_for_task(self, task_id: str) -> list[dict[str, Any]]:
        info = await self.get_task_info(task_id)
        return list(info.get("positions", []))

    async def get_open_tasks(self) -> list[dict[str, Any]]:
        return [task for task in await self.list_tasks() if task.get("status") == "open"]

    async def get_closed_tasks(self) -> list[dict[str, Any]]:
        return [task for task in await self.list_tasks() if task.get("status") == "closed"]

    async def get_open_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return await self._filter_positions(status="open", task_id=task_id)

    async def get_pending_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return await self._filter_positions(status="pending", task_id=task_id)

    async def get_closed_positions(self, task_id: str | None = None) -> list[dict[str, Any]]:
        return await self._filter_positions(status="closed", task_id=task_id)

    async def task_exists(self, task_id: str) -> bool:
        try:
            await self.get_task(task_id)
            return True
        except SimulatorClientError:
            return False

    async def position_exists(self, position_id: str) -> bool:
        try:
            await self.get_position(position_id)
            return True
        except SimulatorClientError:
            return False

    async def find_task(
        self,
        *,
        portfolio_id: str | None = None,
        user_id: str | None = None,
        market: str | None = None,
        status: str | None = None,
    ) -> list[dict[str, Any]]:
        tasks = await self.list_tasks()
        if portfolio_id is not None:
            tasks = [item for item in tasks if item.get("portfolio_id") == portfolio_id]
        if user_id is not None:
            tasks = [item for item in tasks if item.get("user_id") == user_id]
        if market is not None:
            tasks = [item for item in tasks if item.get("market") == market]
        if status is not None:
            tasks = [item for item in tasks if item.get("status") == status]
        return tasks

    async def get_task_last_price(self, task_id: str) -> float | None:
        task = await self.get_task(task_id)
        last_price = task.get("last_price")
        return float(last_price) if last_price is not None else None

    async def summarize_task(self, task_id: str) -> dict[str, Any]:
        info = await self.get_task_info(task_id)
        task = info.get("task", {})
        positions = list(info.get("positions", []))

        realized_pnl = sum(
            float(position.get("pnl") or 0)
            for position in positions
            if position.get("status") == "closed"
        )

        return {
            "task": task,
            "positions": positions,
            "count_positions": len(positions),
            "count_open_positions": len([p for p in positions if p.get("status") == "open"]),
            "count_pending_positions": len([p for p in positions if p.get("status") == "pending"]),
            "count_closed_positions": len([p for p in positions if p.get("status") == "closed"]),
            "realized_pnl": round(realized_pnl, 4),
            "available_units": task.get("available_units"),
            "last_price": task.get("last_price"),
        }

    async def _filter_positions(self, *, status: str, task_id: str | None = None) -> list[dict[str, Any]]:
        if task_id is None:
            positions = await self.list_positions()
        else:
            positions = await self.get_positions_for_task(task_id)
        return [position for position in positions if position.get("status") == status]


async def _read_aiohttp_payload(response: aiohttp.ClientResponse) -> Any:
    text = await response.text()
    if not text:
        return {}
    return _safe_json_loads(text)


def _normalize_base_url(base_url: str) -> str:
    if not base_url:
        raise ValueError("simulator base_url can not be empty")
    return base_url.rstrip("/")


def _join_url(base_url: str, path: str, *, params: dict[str, Any] | None = None) -> str:
    url = f"{_normalize_base_url(base_url)}{path if path.startswith('/') else '/' + path}"
    if params:
        encoded_params = urllib.parse.urlencode({key: value for key, value in params.items() if value is not None})
        if encoded_params:
            url = f"{url}?{encoded_params}"
    return url


def _build_base_url_from_host_port(host: str, port: str | int, scheme: str = "http") -> str:
    host = str(host).strip() or "127.0.0.1"
    port = str(port).strip() or "8007"
    return f"{scheme}://{host}:{port}"


def _safe_json_loads(raw: str) -> Any:
    try:
        return json.loads(raw)
    except Exception:
        return {"raw": raw}


def _extract_error_detail(payload: Any) -> str | None:
    if isinstance(payload, dict):
        detail = payload.get("detail")
        if isinstance(detail, str):
            return detail
        error = payload.get("error")
        if isinstance(error, str):
            return error
        message = payload.get("message")
        if isinstance(message, str):
            return message
    return None


def _unwrap_result(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise SimulatorApiError("Invalid simulator response payload", payload=payload)

    if "success" not in payload:
        return payload

    if payload.get("success") is False:
        raise SimulatorApiError(_extract_error_detail(payload) or "Simulator returned success=false", payload=payload)

    result = payload.get("result")
    if isinstance(result, dict):
        return result

    if result is None:
        return {}

    raise SimulatorApiError("Simulator result payload is not a dict", payload=payload)


def build_simulator_client_from_env() -> SimulatorClient:
    return SimulatorClient.from_env()


def build_async_simulator_client_from_env() -> AsyncSimulatorClient:
    return AsyncSimulatorClient.from_env()


__all__ = [
    "AsyncSimulatorClient",
    "SimulatorApiError",
    "SimulatorClient",
    "SimulatorClientConfig",
    "SimulatorClientError",
    "SimulatorHttpError",
    "build_async_simulator_client_from_env",
    "build_simulator_client_from_env",
]
