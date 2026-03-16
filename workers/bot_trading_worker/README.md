# Bot Trading Worker

## What this worker does

`bot_trading_worker` manages trading bots as **task-oriented bots**.

Each bot is bound to:
- `portfolio_id`
- `market`
- `strategy`
- `user_id`

A deterministic `task_id` is generated from that tuple. Multiple bots can share the same task tuple (same `task_id`) to support parallel workers for one portfolio strategy.

For now, execution is simulator-first (`run_mode=simulator`). Real execution remains pluggable for future switch.

## Core features

- Create/remove/start/stop bots.
- Get overall runtime status.
- Get status per task (`get_task_status`).
- Keep and fetch per-task event logs (`get_task_logs`).
- Strategy actions can:
  - create positions/orders
  - close positions/orders
  - update orders (SL/TP and similar fields)

## API

### `POST /trading/process`
Supported `action`:
- `start`
- `stop`
- `status`
- `list_bots`
- `create_bot`
- `remove_bot`
- `start_bot`
- `stop_bot`
- `activate_bot`
- `deactivate_bot`
- `get_task_status`
- `get_task_logs`

### Create bot request

```json
{
  "action": "create_bot",
  "user_id": "user-1",
  "portfolio_id": "portfolio-1",
  "market": "xag",
  "strategy": "ema_wall_v1",
  "simulator_task_id": "sim-task-1",
  "mobile": "09123456789",
  "password": "your-password",
  "domain": "https://hivagold.com",
  "run_mode": "simulator",
  "active": false,
  "metadata": {
    "external_source": "signal-provider-a"
  }
}
```
