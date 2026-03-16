# Bot Simulator Worker

## What this worker does

`bot_simulator_worker` is a file-based execution simulator for bot trading. It stores positions/history and computes PnL without a real broker backend.

## How this worker is used

- Called by `bot_trading_worker` when bot `run_mode` is `simulator`.
- Useful for local development/backtesting-like integration.

Default local base URL:

- `http://localhost:8004`

## Authentication

All endpoints except `GET /health` require API key header:

```http
x-api-key: <BOT_API_KEY>
```

## APIs

### `GET /health`
Health probe.

### `POST /portfolio/orders`
Create simulated position.

```json
{
  "mobile": "09123456789",
  "domain": "https://hivagold.com",
  "strategy": "ema_wall_v1",
  "symbol": "xag",
  "side": "buy",
  "entry_type": "market",
  "entry_price": 31.2,
  "take_profit": 32.0,
  "stop_loss": 30.7,
  "volume": 1.0
}
```

### `PATCH /portfolio/users/{mobile}/positions/{position_id}`
Update TP/SL/entry/volume.

```json
{
  "take_profit": 32.1,
  "stop_loss": 30.8,
  "entry_price": 31.2,
  "volume": 1.2
}
```

### `POST /portfolio/users/{mobile}/positions/{position_id}/close`
Close position.

```json
{
  "close_price": 31.9,
  "reason": "manual"
}
```

### `POST /portfolio/price`
Feed market price tick.

```json
{
  "mobile": "09123456789",
  "symbol": "xag",
  "price": 31.85
}
```

### `GET /portfolio/users/{mobile}/stats`
Get user aggregated simulator stats.

### `GET /portfolio/users/{mobile}/history`
Get user simulated history.

### `GET /portfolio/db/records`
Get all stored simulator records.

### `GET /portfolio/strategies/{strategy}/pnl-positions`
List positions and total PnL for a strategy.

### `GET /portfolio/admin/db`
Admin alias for full DB records.

## Full API examples (curl)

```bash
API_KEY='changeme'

# health
curl http://localhost:8004/health

# create position
curl -X POST http://localhost:8004/portfolio/orders \
  -H "x-api-key: ${API_KEY}" -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","domain":"https://hivagold.com","strategy":"ema_wall_v1","symbol":"xag","side":"buy","entry_type":"market","entry_price":31.2,"take_profit":32.0,"stop_loss":30.7,"volume":1.0}'

# update position
curl -X PATCH http://localhost:8004/portfolio/users/09123456789/positions/1 \
  -H "x-api-key: ${API_KEY}" -H 'Content-Type: application/json' \
  -d '{"take_profit":32.1,"stop_loss":30.8}'

# close position
curl -X POST http://localhost:8004/portfolio/users/09123456789/positions/1/close \
  -H "x-api-key: ${API_KEY}" -H 'Content-Type: application/json' \
  -d '{"close_price":31.9,"reason":"manual"}'

# price tick
curl -X POST http://localhost:8004/portfolio/price \
  -H "x-api-key: ${API_KEY}" -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","symbol":"xag","price":31.85}'

# user stats
curl -H "x-api-key: ${API_KEY}" http://localhost:8004/portfolio/users/09123456789/stats

# user history
curl -H "x-api-key: ${API_KEY}" http://localhost:8004/portfolio/users/09123456789/history

# db records
curl -H "x-api-key: ${API_KEY}" http://localhost:8004/portfolio/db/records

# strategy pnl report
curl -H "x-api-key: ${API_KEY}" http://localhost:8004/portfolio/strategies/ema_wall_v1/pnl-positions

# admin db
curl -H "x-api-key: ${API_KEY}" http://localhost:8004/portfolio/admin/db
```
