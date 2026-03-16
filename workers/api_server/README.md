# API Server Worker

## What this worker does

`api_server` is the public gateway for the bot platform. It exposes a simplified HTTP API and forwards requests to internal workers:

- `bot_auth_worker` for login/logout.
- `bot_trading_worker` for bot lifecycle operations.

## How this worker is used

Use this service as the single entrypoint from UI/scripts/automation. Instead of calling internal workers directly, call `api_server` endpoints.

Default local base URL:

- `http://localhost:8000`

## APIs

### `GET /health`
Health probe.

### `POST /login`
Authenticate a mobile account via auth worker.

Request body:
```json
{
  "mobile": "09123456789",
  "password": "your-password",
  "max_retries": 3,
  "base_domain": "https://hivagold.com"
}
```

### `POST /logout`
Logout an account via auth worker.

Request body:
```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com"
}
```

### `POST /bots/create`
Create/register a bot in trading worker.

Request body:
```json
{
  "mobile": "09123456789",
  "password": "your-password",
  "domain": "https://hivagold.com",
  "strategy": "ema_wall_v1",
  "room": "xag",
  "run_mode": "simulator",
  "active": false,
  "metadata": {
    "portfolio_id": "optional"
  }
}
```

### `POST /bots/remove`
Remove bot by `bot_id` or by unique identity (`mobile` + `domain` and optional strategy/room/run_mode).

Request body (by id):
```json
{
  "bot_id": "bot-123abc456def"
}
```

### `POST /bots/start`
Activate/start an existing bot.

Request body:
```json
{
  "bot_id": "bot-123abc456def"
}
```

### `POST /bots/stop`
Deactivate/stop an existing bot.

Request body:
```json
{
  "bot_id": "bot-123abc456def"
}
```

## Full API examples (curl)

```bash
# health
curl http://localhost:8000/health

# login
curl -X POST http://localhost:8000/login \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass","max_retries":3,"base_domain":"https://hivagold.com"}'

# logout
curl -X POST http://localhost:8000/logout \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","base_domain":"https://hivagold.com"}'

# create bot
curl -X POST http://localhost:8000/bots/create \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass","domain":"https://hivagold.com","strategy":"ema_wall_v1","room":"xag","run_mode":"simulator","active":false,"metadata":{}}'

# start bot
curl -X POST http://localhost:8000/bots/start \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-123abc456def"}'

# stop bot
curl -X POST http://localhost:8000/bots/stop \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-123abc456def"}'

# remove bot
curl -X POST http://localhost:8000/bots/remove \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-123abc456def"}'
```
