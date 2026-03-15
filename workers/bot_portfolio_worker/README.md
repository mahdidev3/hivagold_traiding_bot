# Bot Portfolio Worker (Strategy Tester)

This worker was redesigned to act as a **strategy backtest/simulation sink** for live market events produced by `bot_trading_worker`.

## What it does now
- No per-user portfolio logic.
- Keeps one virtual portfolio per **strategy module**.
- Consumes Redis pub/sub events from trading worker:
  - `price`
  - `live-bars`
  - `wall`
  - `signal`
- Opens virtual positions on `signal` events and stores `symbol` per position.
- Evaluates open/pending positions only for matching-symbol `price` events.
- Stores trade history and computes:
  - wins/losses
  - win rate
  - total PnL

## Event Contract (Redis channel)
Channel: `REDIS_MARKET_EVENT_CHANNEL` (default `bot.market.events`).

Examples:
```json
{"event":"price","payload":{"price":2481.2,"symbol":"xag"}}
```

```json
{"event":"signal","payload":{"strategy":"ema_wall_v1","symbol":"xag","status":"signal","recommendation":{"action":"buy","ordertype":"market","price":2481.2,"units":1,"take_profit":2491.2,"stop_loss":2473.0}}}
```

## Database tables
- `strategy_portfolios`
- `strategy_positions` (includes `symbol` column)

## API
All endpoints except `/health` require `x-api-key`.

### Process action
`POST /portfolio/process`
```json
{
  "action": "strategy_stats",
  "payload": {"strategy": "ema_wall_v1"}
}
```

Supported actions:
- `event` → manually push one event payload
- `price_tick` → manual price simulation (supports optional `symbol` to target matching positions only)
- `strategy_stats` → strategy performance snapshot
- `list_strategies` → discovered strategy portfolios
- `status`

### Read endpoints
- `GET /portfolio/db/records` → returns all DB rows from `strategy_portfolios` and `strategy_positions` with counts.
- `GET /portfolio/strategies/{strategy}/pnl-positions` → returns strategy stats + all positions for the strategy.
- `GET /portfolio/admin/db` → returns full DB snapshot + per-strategy aggregates (admin view).

Examples:
```bash
curl http://localhost:8007/portfolio/db/records \
  -H "x-api-key: change-me"

curl http://localhost:8007/portfolio/strategies/ema_wall_v1/pnl-positions \
  -H "x-api-key: change-me"

curl http://localhost:8007/portfolio/admin/db \
  -H "x-api-key: change-me"
```

## Environment
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`
- `REDIS_MARKET_EVENT_CHANNEL=bot.market.events`
- `DATABASE_PATH=portfolio_worker.db`
- `BOT_API_KEY=...`

## Run
```bash
python run.py
```

## Docker
```bash
docker compose up -d
```

Make sure trading worker and portfolio worker are on the same docker bridge network (`hivagold`) and use service DNS names, not localhost.
