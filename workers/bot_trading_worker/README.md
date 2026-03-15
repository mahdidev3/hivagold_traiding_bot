# Bot Trading Worker

Trading runtime service for running per-user strategy bots and streaming bot events.

## Responsibilities

- Loads bot definitions from `users.json`.
- Opens market data streams (`live-bars`, `price`, `wall`) for each active bot.
- Runs strategy logic per active bot task context.
- Sends bot-mode orders to simulator when `run_mode=simulator`.
- Publishes internal bot events to HTTP + WebSocket consumers.

## HTTP / WebSocket API

- `GET /health`
- `POST /trading/process`
  - Supported actions: `start`, `stop`, `status`, `list_bots`, `activate_bot`, `deactivate_bot`
- `GET /signals/latest`
- `WS /signals/ws`

## `POST /trading/process` payload shape

```json
{
  "action": "activate_bot",
  "mobile": "0912...",
  "strategy": "ema_wall_v1",
  "room": "xag",
  "run_mode": "simulator"
}
```

## Bot config (`users.json`)

```json
[
  {
    "mobile": "0912...",
    "password": "...",
    "domain": "https://hivagold.com",
    "strategy": "ema_wall_v1",
    "room": "xag",
    "run_mode": "simulator",
    "active": true,
    "metadata": {}
  }
]
```

## Important env vars

- `TRADING_WORKER_HOST`, `TRADING_WORKER_PORT`
- `TRADING_USERS_JSON_PATH`
- `WS_LIVE_BARS_PATH`, `WS_PRICE_PATH`, `WS_WALL_PATH`
- `WS_EXTERNAL_PRICE_URL` (optional)
- `BARS_API_PATH`, `BARS_POLL_INTERVAL_SECONDS`
- `TRADING_AUTO_START`
- `SIMULATOR_WORKER_URL`, `SIMULATOR_API_KEY`
