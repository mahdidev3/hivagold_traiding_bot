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
- Modular strategy runtime (base template + analysis modules + signal handler)
- Simulator-first position execution (real market can be enabled later by execution settings)

## Strategy architecture

- Base template: `app/strategies/base.py`
  - `StrategyRuntime` (cycle interface)
  - `AnalysisModule` (analysis interface)
  - `StrategySignal` (signal contract)
- Analysis modules: `app/strategies/modules.py`
  - `PriceMomentumModule`
  - `CandleDirectionModule`
- Strategy implementation: `app/strategies/simple_position_test.py`
  - Combines module outputs to generate `open_position` signals.
- Signal handler in service:
  - `_handle_strategy_signal(...)` routes signals to execution.
  - For now, execution uses simulator API only.

## Position execution settings (from bot metadata)

You can control **HTTP method** and **URL** for opening position:

- `position_open_method` (default: `POST`)
- `position_open_url` (default: `/simulator/tasks/{task_id}/positions`)
- `execution_api_base` or `simulator_url` (default: `http://bot-simulator-worker-service:8007`)
- `simulator_api_key` (or worker `BOT_API_KEY`) for `X-API-Key`

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
    "execution_api_base": "http://bot-simulator-worker-service:8007",
    "position_open_method": "POST",
    "position_open_url": "/simulator/tasks/sim-task-abc/positions",
    "simulator_api_key": "change-me",
    "units": 0.1,
    "take_profit": 2600,
    "stop_loss": 2400,
    "market_state": {
      "price": 2520.0,
      "candles": [
        {"open": 2500, "close": 2510},
        {"open": 2510, "close": 2520}
      ]
    }
  }
}
```

### 2) Start bot

```json
{ "action": "start_bot", "bot_id": "bot-123" }
```

### 3) Task status

```json
{ "action": "get_task_status", "task_id": "task-..." }
```

### 4) Task logs

```json
{ "action": "get_task_logs", "task_id": "task-..." }
```

## Current behavior of `simple_position_test_v1`

1. Reads price/candles from strategy market state.
2. Runs two independent analysis modules.
3. Produces one `open_position` signal if analysis threshold is met.
4. Logs terminal-visible events + task logs:
   - open-position request (method/url/payload)
   - open-position response
5. Calls simulator API to create the position.

This is simulator-first today and intentionally clean/modular for future real execution integration.
