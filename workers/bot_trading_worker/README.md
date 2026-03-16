# Bot Trading Worker

## What this worker does

`bot_trading_worker` is the bot runtime engine.

It can:

- Manage bot lifecycle (create/remove/start/stop/list/status).
- Start async strategy loops for active bots.
- Consume market data streams.
- Send execution to:
  - `bot_simulator_worker` in `run_mode=simulator`
  - `bot_room_worker` in `run_mode=real`

## How this worker is used

- Usually called by `api_server` for bot management.
- Can be called directly to control runtime actions.
- On startup, optionally auto-starts runtime (`TRADING_AUTO_START`).

Default local base URL:

- `http://localhost:8005`

## APIs

### `GET /health`
Health probe.

### `POST /trading/process`
Single action endpoint for trading worker commands.

Supported `action` values:

- `start`
- `stop`
- `status`
- `list_bots`
- `create_bot`
- `remove_bot`
- `start_bot`
- `stop_bot`
- `activate_bot` (alias of start)
- `deactivate_bot` (alias of stop)

Request base schema:

```json
{
  "action": "create_bot",
  "mobile": "09123456789",
  "password": "your-password",
  "domain": "https://hivagold.com",
  "bot_id": "optional",
  "strategy": "ema_wall_v1",
  "room": "xag",
  "run_mode": "simulator",
  "active": false,
  "metadata": {}
}
```

## Full API examples (curl)

```bash
# health
curl http://localhost:8005/health

# start runtime
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'

# status
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"status"}'

# create bot
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"create_bot","mobile":"09123456789","password":"pass","domain":"https://hivagold.com","strategy":"ema_wall_v1","room":"xag","run_mode":"simulator","active":false,"metadata":{}}'

# list bots
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"list_bots"}'

# activate/start bot
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"start_bot","bot_id":"bot-123abc456def"}'

# deactivate/stop bot
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"stop_bot","bot_id":"bot-123abc456def"}'

# remove bot
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"remove_bot","bot_id":"bot-123abc456def"}'

# stop runtime
curl -X POST http://localhost:8005/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"stop"}'
```
