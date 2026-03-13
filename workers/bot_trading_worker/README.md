# Bot Trading Worker

Bot Trading Worker now runs as a **strategy-module service**. It keeps the existing websocket communication for `price`, `live-bars`, and `wall`, and evaluates enabled strategy modules on top of that live stream.

## Architecture
- Keeps existing WS channels:
  - `price` → latest market price
  - `live-bars` → OHLC bars
  - `wall` → orderbook buy/sell walls
- Builds one shared market state per user session.
- Runs strategy modules over shared state.
- Publishes:
  - strategy signals to HTTP/WS clients
  - market events + signals to Redis channel (`bot.market.events`) for portfolio testing worker

## Current Strategy Modules
- `ema_wall_v1` (implemented existing logic)
  - EMA alignment
  - Momentum
  - Wall imbalance + microprice
  - ATR-based SL/TP

## Environment Variables
Important:
- `REDIS_HOST=redis` (bridge/service DNS)
- `REDIS_MARKET_EVENT_CHANNEL=bot.market.events`
- `ENABLE_STRATEGY_EMA_WALL_V1=true|false`

Existing settings are still respected (`WS_*`, `BARS_*`, risk settings, etc.).

## API
- `POST /trading/process` with actions: `start`, `stop`, `status`, `latest_signals`
- `GET /signals/latest`
- `WS /signals/ws`

## Run
```bash
python run.py
```

## Docker
```bash
docker compose up -d
```

Use bridge DNS for dependencies (e.g. `redis`) instead of localhost.
