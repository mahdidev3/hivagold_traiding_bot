# Bot Simulator Worker

File-based trading/simulation worker (no Redis, no database).

## Features
- Create / update / close positions via API.
- Keep per-user history in `../bot_auth_worker/Users/<mobile>/SimulatorHistory.json`.
- Compute user pnl/win-rate stats and expose history.
- Read cookies/headers from `../bot_auth_worker/Users/<mobile>/User_info.json` (also supports `Userinfo.json`).
- Auto-connect to HivaGold price websocket and update positions by incoming price.
- Connect to helper websocket and run `helper-candle-break-v1` strategy task.
- Log each position and strategy update in terminal.

## Key endpoints
- `POST /portfolio/orders`
- `PATCH /portfolio/users/{mobile}/positions/{position_id}`
- `POST /portfolio/users/{mobile}/positions/{position_id}/close`
- `GET /portfolio/users/{mobile}/pnl`
- `GET /portfolio/users/{mobile}/history`
- `POST /strategy/tasks`
- `DELETE /strategy/tasks/{task_id}`
- `GET /strategy/tasks`

All endpoints except `/health` require `x-api-key`.
