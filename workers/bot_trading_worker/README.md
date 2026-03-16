# Bot Trading Worker

This worker manages **trading bot tasks** grouped by:

- `portfolio_id`
- `market`
- `strategy`
- `user_id`

A deterministic `task_id` is generated from `<portfolio_id, market, strategy, user_id>`.
Multiple bots are supported on the same tuple, each with its own `bot_id`.

## What it supports

- Create bot task records and bot instances
- Multiple bots on same task key
- Start/stop (activate/deactivate) bots
- Task status lookup (`get_task_status`)
- Task logs (`get_task_logs`)
- Per-task session usage (mobile/password + saved cookies/headers from auth worker storage)
- Per-task WS stream planning (`price`, `live-bars`, `wall`, `external-price`)
- Simple test strategy: `simple_position_test_v1` (creates one simulator position)

## Main actions (`/trading/process`)

### 1) Create bot

```json
{
  "action": "create_bot",
  "user_id": "u-100",
  "portfolio_id": "p-500",
  "market": "xag",
  "strategy": "simple_position_test_v1",
  "simulator_task_id": "sim-task-abc",
  "mobile": "09120000000",
  "password": "secret",
  "domain": "https://hivagold.com",
  "metadata": {
    "ws_streams": ["price", "live-bars", "external-price"],
    "external_price_ws": "wss://feed.example/ws",
    "simulator_url": "http://bot-simulator-worker-service:8007",
    "units": 0.1,
    "take_profit": 2600,
    "stop_loss": 2400
  }
}
```

Response example:

```json
{
  "success": true,
  "result": {
    "bot_id": "bot-123...",
    "task_id": "task-<deterministic-hash>",
    "strategy": "simple_position_test_v1",
    "active": false
  }
}
```

### 2) Start bot

```json
{ "action": "start_bot", "bot_id": "bot-123" }
```

or with task id when only one bot exists for that task:

```json
{ "action": "activate_bot", "task_id": "task-..." }
```

### 3) Stop bot

```json
{ "action": "stop_bot", "bot_id": "bot-123" }
```

### 4) Task status

```json
{ "action": "get_task_status", "task_id": "task-..." }
```

### 5) Task logs

```json
{ "action": "get_task_logs", "task_id": "task-..." }
```

## Simple strategy behavior

`simple_position_test_v1`:

1. Loads per-task session (cookies/headers) using mobile + domain.
2. Builds WS url map based on market + requested streams.
3. Runs modular analysis (price + candles) and if valid, calls simulator `POST /simulator/tasks/{task_id}/positions`.
4. Writes logs for start, ws config, and position create result.

## Full flow with simulator

1. Create simulator task manually.
2. Call `create_bot` and pass `simulator_task_id`.
3. Start bot using `start_bot`.
4. Check status with `get_task_status`.
5. Read logs with `get_task_logs`.

This design is simulator-first today and flexible for future migration to real HivaGold execution.
