# Bot Trading Worker

Trading runtime service that executes strategy loops per configured bot (user + domain + room).

## Responsibilities

- Loads bot definitions from `users.json`.
- Starts one async runtime loop per active bot.
- Maintains WS subscriptions (`live-bars`, `price`, `wall`, and optional external price WS).
- Runs strategy modules (currently `ema_wall_v1`) and converts strategy actions into execution calls.
- Sends execution to simulator when `run_mode=simulator` and to room APIs when `run_mode=real`.

## HTTP API

- `GET /health`
- `POST /trading/process`

### `POST /trading/process` actions

Supported `action` values:

- `start`
- `stop`
- `status`
- `list_bots`
- `activate_bot`
- `deactivate_bot`

### Request examples

Start worker runtime:

```json
{ "action": "start" }
```

Activate existing bot by identity (mobile + domain):

```json
{
  "action": "activate_bot",
  "mobile": "0912...",
  "domain": "https://hivagold.com"
}
```

Deactivate by `bot_id`:

```json
{
  "action": "deactivate_bot",
  "bot_id": "bot-123456789abc"
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
    "metadata": {
      "portfolio_id": "optional-portfolio-id"
    }
  }
]
```

## Important env vars

- `TRADING_WORKER_HOST`, `TRADING_WORKER_PORT`
- `TRADING_USERS_JSON_PATH`
- `TRADING_AUTO_START`
- `WS_LIVE_BARS_PATH`, `WS_PRICE_PATH`, `WS_WALL_PATH`
- `WS_EXTERNAL_PRICE_URL` (optional)
- `BARS_API_PATH`, `BARS_POLL_INTERVAL_SECONDS`
- `SIMULATOR_WORKER_URL`, `SIMULATOR_API_KEY`
