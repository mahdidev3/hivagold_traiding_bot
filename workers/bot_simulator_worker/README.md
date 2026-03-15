# Bot Simulator Worker

File-based trading simulator (no Redis, no database).

## Features
- Create / update / close positions via API.
- Keep per-user history in `../bot_auth_worker/Users/<mobile>/SimulatorHistory.json`.
- Compute user pnl/win-rate stats.
- Read cookies/headers from `../bot_auth_worker/Users/<mobile>/User_info.json` (also supports `Userinfo.json`).
- Auto-connect to HivaGold price websocket and update positions by incoming price.
- Logs each position change in terminal.

## Key endpoints
- `POST /portfolio/orders`
- `PATCH /portfolio/users/{mobile}/positions/{position_id}`
- `POST /portfolio/users/{mobile}/positions/{position_id}/close`
- `POST /portfolio/price`
- `GET /portfolio/users/{mobile}/stats`
- `GET /portfolio/users/{mobile}/history`
- `GET /portfolio/db/records`
- `GET /portfolio/admin/db`

All endpoints except `/health` require `x-api-key`.
