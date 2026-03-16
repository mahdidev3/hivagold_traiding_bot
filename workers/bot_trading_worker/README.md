# Bot Trading Worker

`bot_trading_worker` runs task-based trading bots.

## Task identity
Each bot belongs to a deterministic task built from:
- `portfolio_id`
- `market`
- `strategy`
- `user_id`

The worker generates `task_id` from that tuple.

Multiple bots can run on the same task (same tuple) for scaling/redundancy.

## Important behavior
1. **Per-bot session and WS**
   - Every active bot creates its own session using saved cookies/headers from auth storage (keyed by mobile + domain).
   - Each bot opens its own websocket connections for the task market.
2. **Per-task selectable streams**
   - Default streams: `live-bars`, `price`, `wall`
   - Optional `external-price`
   - You can choose streams with `metadata.ws_streams`.
3. **Simulator-first execution**
   - Use `run_mode=simulator`.
   - If you already created simulator task, pass `simulator_task_id` in create payload.

## Strategy list
- `ema_wall_v1`
- `simple_position_test_v1` (new test strategy)
  - Opens a single BUY market position when no open position exists for that task runtime.

## API
Endpoint: `POST /trading/process`

Actions:
- `start`, `stop`, `status`, `list_bots`
- `create_bot`, `remove_bot`, `start_bot`, `stop_bot`
- `activate_bot`, `deactivate_bot`
- `get_task_status`, `get_task_logs`

## Full test flow (curl)

```bash
# 1) Health
curl http://localhost:8006/health

# 2) Start worker runtime
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"start"}'

# 3) Create bot for an existing simulator task
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{
    "action":"create_bot",
    "user_id":"user-1",
    "portfolio_id":"portfolio-1",
    "market":"xag",
    "strategy":"simple_position_test_v1",
    "simulator_task_id":"sim-task-123",
    "mobile":"09123456789",
    "password":"pass",
    "domain":"https://hivagold.com",
    "run_mode":"simulator",
    "active":false,
    "metadata":{
      "external_source":"manual-test",
      "ws_streams":["price","wall"],
      "external_price_ws":"wss://feed.example/ws"
    }
  }'

# 4) Start bot
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"start_bot","bot_id":"bot-xxxxxxxxxxxx"}'

# 5) Inspect task status
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"get_task_status","task_id":"task-xxxxxxxxxxxxxxxx"}'

# 6) Inspect task logs
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"get_task_logs","task_id":"task-xxxxxxxxxxxxxxxx"}'

# 7) Stop bot
curl -X POST http://localhost:8006/trading/process \
  -H 'Content-Type: application/json' \
  -d '{"action":"stop_bot","bot_id":"bot-xxxxxxxxxxxx"}'
```
