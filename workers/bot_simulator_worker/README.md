# Bot Simulator Worker

File-based portfolio simulator service (no database).

## Features

- Create/update/close user positions.
- Persist user simulator history under auth user storage.
- Compute per-user stats (pnl/win-rate).
- Aggregate strategy-level closed pnl.
- Background websocket price feed updates open positions.

## Auth

All endpoints except `/health` require header:

```http
x-api-key: <BOT_API_KEY>
```

## Endpoints

- `GET /health`
- `POST /portfolio/orders`
- `PATCH /portfolio/users/{mobile}/positions/{position_id}`
- `POST /portfolio/users/{mobile}/positions/{position_id}/close`
- `POST /portfolio/price`
- `GET /portfolio/users/{mobile}/stats`
- `GET /portfolio/users/{mobile}/history`
- `GET /portfolio/db/records`
- `GET /portfolio/strategies/{strategy}/pnl-positions`
- `GET /portfolio/admin/db`

## Storage

- User source dir: `USERS_STORAGE_DIR` (default `../bot_auth_worker/Users`)
- History file: `SIMULATOR_HISTORY_FILE` (default `SimulatorHistory.json`)

## Main env vars

- `SIMULATOR_WORKER_HOST`, `SIMULATOR_WORKER_PORT`
- `BOT_API_KEY`
- `USERS_STORAGE_DIR`, `SIMULATOR_HISTORY_FILE`
- `WS_PRICE_PATH`, `PRICE_WS_SUBSCRIBE_MESSAGE`, `PRICE_WS_SYMBOL`
