# Bot Portfolio Worker

Portfolio execution service for Hivagold-like trading rules. It consumes price ticks (manual endpoint or websocket), manages entry/TP/SL, and tracks per-user performance stats.

## Features
- Open **buy** or **sell** orders.
- Support **immediate (market)** entry or **entry order (limit/pending)**.
- Attach TP and SL to every order.
- Portfolio volume rules per user (`fixed` or `balance_percent` strategy proxy).
- Auto-close orders when TP/SL is hit based on incoming prices.
- Bot-friendly API endpoint to create orders programmatically.
- Persists closed-trade **PnL** and computes **win rate** per user.
- API key protection on all write/read-sensitive endpoints.

## Quick Start
1. Copy environment file:
   - `cp .env.example .env`
2. Set a strong `BOT_API_KEY`.
3. Run service:
   - `python run.py`

## Docker
```bash
docker compose up -d
docker compose logs -f portfolio-worker
```

## PowerShell helper
```powershell
./manage.ps1 -Action up
./manage.ps1 -Action logs
```

## API
All endpoints require `x-api-key: <BOT_API_KEY>` except `/health`.

### Create/Update portfolio rule
`POST /portfolio/rules`
```json
{
  "user_id": "u1001",
  "rule": {
    "name": "main-rule",
    "strategy": "fixed",
    "fixed_volume": 2,
    "max_open_orders": 3
  }
}
```

### Create order (manual)
`POST /portfolio/orders`
```json
{
  "user_id": "u1001",
  "side": "buy",
  "entry_type": "limit",
  "entry_price": 2480.5,
  "take_profit": 2490.0,
  "stop_loss": 2470.0,
  "symbol": "xag"
}
```

### Create order from trader bot
`POST /portfolio/orders/bot`
```json
{
  "user_id": "u1001",
  "side": "sell",
  "take_profit": 2460.0,
  "stop_loss": 2480.0,
  "volume": 1.5,
  "symbol": "xag"
}
```

### Push price tick
`POST /portfolio/price`
```json
{ "symbol": "xag", "price": 2481.2 }
```

### User performance
`GET /portfolio/users/{user_id}/stats`

Returns closed trades count, wins/losses, win rate, and total PnL.
