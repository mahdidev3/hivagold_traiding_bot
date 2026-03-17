from __future__ import annotations

from time import sleep
from typing import Any

from ..clients import SimulatorClient, SimulatorClientError
from .strategy_base import StrategyBase


class ClientTestStrategy(StrategyBase):
    """A simple one-shot strategy that exercises the simulator client.

    Required BotConfig fields:
    - bot_id
    - portfolio_id
    - run_mode='simulator'

    Useful metadata:
    - market: str = 'xag'
    - user_id: str = bot_id
    - domain: str | None
    - initial_units: float = 20
    - start_price: float = 3200
    - buy_units: float = 2
    - sell_units: float = 1
    - buy_take_profit_offset: float = 25
    - buy_stop_loss_offset: float = 12
    - limit_entry_offset: float = 15
    - limit_take_profit_offset: float = 20
    - limit_stop_loss_offset: float = 10
    - update_limit_entry_offset: float = 10
    - update_limit_stop_loss_offset: float = 12
    - price_sequence: list[float]
    - sleep_seconds: float = 0.5
    - auto_close_positions: bool = True
    - auto_close_task: bool = True
    - close_task_reason: str = 'client_test_finished'
    - task_id: str | None
    """

    def __init__(self, config):
        super().__init__(config)
        self.client = SimulatorClient.from_env()
        self.task_id: str | None = None
        self.market: str | None = None
        self.created_position_ids: list[str] = []

    def handle_command(self, command: str, payload: dict[str, Any]) -> None:
        if command == "ping":
            self.log("INFO", f"pong bot={self.config.bot_id} payload={payload}")
            return

        if command == "push_price":
            if not self.task_id or not self.market:
                self.log("WARNING", "push_price ignored because task is not ready")
                return
            price = payload.get("price")
            if price is None:
                self.log("WARNING", "push_price requires payload.price")
                return
            result = self.client.push_price(
                self.task_id, market=self.market, price=float(price)
            )
            self.log("INFO", f"push_price command result={result}")
            return

        if command == "close_task":
            if not self.task_id:
                self.log("WARNING", "close_task ignored because task is not ready")
                return
            result = self.client.close_task(
                self.task_id, reason=str(payload.get("reason") or "command_close_task")
            )
            self.log("INFO", f"close_task command result={result}")
            return

        super().handle_command(command, payload)

    def run(self) -> None:
        if self.config.run_mode != "simulator":
            raise ValueError(
                f"ClientTestStrategy only supports run_mode='simulator', got {self.config.run_mode!r}"
            )

        metadata = dict(self.config.metadata or {})
        self.market = str(metadata.get("market") or "xag")
        sleep_seconds = float(metadata.get("sleep_seconds", 0.5))

        self.log(
            "INFO",
            (
                "ClientTestStrategy started "
                f"bot_id={self.config.bot_id} portfolio_id={self.config.portfolio_id} "
                f"run_mode={self.config.run_mode} market={self.market}"
            ),
        )

        try:
            health = self.client.health()
            self.log("INFO", f"simulator health={health}")

            self.task_id = self._prepare_task(metadata)
            self.log("INFO", f"using task_id={self.task_id}")

            start_price = float(metadata.get("start_price", 3200.0))
            self._push_price(start_price, note="initial price")
            self._sleep(sleep_seconds)

            buy_position_id = self._create_market_buy(metadata, start_price)
            if buy_position_id:
                self.created_position_ids.append(buy_position_id)
                self._sleep(sleep_seconds)

            limit_position_id = self._create_limit_sell(metadata, start_price)
            if limit_position_id:
                self.created_position_ids.append(limit_position_id)
                self._sleep(sleep_seconds)
                self._update_limit_position(limit_position_id, metadata, start_price)
                self._sleep(sleep_seconds)

            for idx, price in enumerate(
                self._build_price_sequence(metadata, start_price), start=1
            ):
                self.process_pending_commands()
                if self._stop_event.is_set():
                    break
                self._push_price(float(price), note=f"price tick #{idx}")
                self._sleep(sleep_seconds)

            summary = self.client.summarize_task(self.task_id)
            self.log("INFO", f"task summary after simulation={summary}")

            if metadata.get("auto_close_positions", True):
                self._close_remaining_open_positions()

            if metadata.get("auto_close_task", True):
                result = self.client.close_task(
                    self.task_id,
                    reason=str(
                        metadata.get("close_task_reason") or "client_test_finished"
                    ),
                )
                self.log("INFO", f"close task result={result}")

            final_summary = self.client.summarize_task(self.task_id)
            self.log("INFO", f"final task summary={final_summary}")

        except SimulatorClientError as exc:
            self.log("ERROR", f"simulator client failed: {exc}")
            raise
        except Exception as exc:
            self.log("ERROR", f"client test strategy failed: {exc}")
            raise
        finally:
            self.log("INFO", "ClientTestStrategy finished")

    def _prepare_task(self, metadata: dict[str, Any]) -> str:
        task_id = metadata.get("task_id")
        if task_id:
            task_id = str(task_id)
            if not self.client.task_exists(task_id):
                raise ValueError(
                    f"metadata.task_id={task_id!r} does not exist in simulator"
                )
            return task_id

        task = self.client.find_task(
            portfolio_id=self.config.portfolio_id,
            market=self.market,
            status="open",
        )
        if task:
            self.log("INFO", f"reusing existing open task id={task['id']}")
            return str(task["id"])

        result = self.client.create_task(
            portfolio_id=self.config.portfolio_id,
            user_id=str(metadata.get("user_id") or self.config.bot_id),
            market=self.market,
            initial_units=float(metadata.get("initial_units", 20.0)),
            domain=metadata.get("domain"),
        )
        created_task_id = str(result["task"]["id"])
        self.log("INFO", f"created simulator task result={result}")
        return created_task_id

    def _create_market_buy(
        self, metadata: dict[str, Any], start_price: float
    ) -> str | None:
        take_profit = start_price + float(metadata.get("buy_take_profit_offset", 25.0))
        stop_loss = start_price - float(metadata.get("buy_stop_loss_offset", 12.0))
        result = self.client.create_market_position(
            self.task_id,
            side="buy",
            units=float(metadata.get("buy_units", 2.0)),
            take_profit=take_profit,
            stop_loss=stop_loss,
            strategy="client_test_strategy_market_buy",
            fallback_entry_price=start_price,
        )
        position_id = str(result["position"]["id"])
        self.log("INFO", f"created market buy position result={result}")
        return position_id

    def _create_limit_sell(
        self, metadata: dict[str, Any], start_price: float
    ) -> str | None:
        entry_price = start_price + float(metadata.get("limit_entry_offset", 15.0))
        take_profit = entry_price - float(
            metadata.get("limit_take_profit_offset", 20.0)
        )
        stop_loss = entry_price + float(metadata.get("limit_stop_loss_offset", 10.0))
        result = self.client.create_limit_position(
            self.task_id,
            side="sell",
            entry_price=entry_price,
            units=float(metadata.get("sell_units", 1.0)),
            take_profit=take_profit,
            stop_loss=stop_loss,
            strategy="client_test_strategy_limit_sell",
        )
        position_id = str(result["position"]["id"])
        self.log("INFO", f"created limit sell position result={result}")
        return position_id

    def _update_limit_position(
        self,
        position_id: str,
        metadata: dict[str, Any],
        start_price: float,
    ) -> None:
        new_entry = start_price + float(metadata.get("update_limit_entry_offset", 10.0))
        updated = self.client.update_position(
            position_id,
            entry_price=new_entry,
            stop_loss=new_entry
            + float(metadata.get("update_limit_stop_loss_offset", 12.0)),
        )
        self.log("INFO", f"updated limit position result={updated}")

        if metadata.get("change_stop_loss_after_update", True):
            changed = self.client.change_stop_loss(
                position_id,
                stop_loss=new_entry
                + float(metadata.get("manual_stop_loss_offset", 11.0)),
            )
            self.log("INFO", f"change stop loss result={changed}")

    def _build_price_sequence(
        self, metadata: dict[str, Any], start_price: float
    ) -> list[float]:
        raw = metadata.get("price_sequence")
        if isinstance(raw, list) and raw:
            return [float(item) for item in raw]

        return [
            start_price + 6.0,
            start_price + 11.0,
            start_price + 28.0,
            start_price + 10.0,
            start_price + 24.0,
            start_price - 12.0,
        ]

    def _push_price(self, price: float, *, note: str) -> None:
        result = self.client.push_price(self.task_id, market=self.market, price=price)
        self.log("INFO", f"{note} result={result}")

    def _close_remaining_open_positions(self) -> None:
        open_positions = self.client.get_open_positions(self.task_id)
        pending_positions = self.client.get_pending_positions(self.task_id)

        for position in [*open_positions, *pending_positions]:
            position_id = str(position["id"])
            result = self.client.close_position_at_market(
                position_id,
                reason="client_test_cleanup",
            )
            self.log("INFO", f"cleanup close position_id={position_id} result={result}")

    def _sleep(self, seconds: float) -> None:
        if seconds <= 0:
            return
        remaining = float(seconds)
        while remaining > 0 and not self._stop_event.is_set():
            self.process_pending_commands()
            slice_seconds = min(0.2, remaining)
            sleep(slice_seconds)
            remaining -= slice_seconds
