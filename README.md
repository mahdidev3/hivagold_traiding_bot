# Hivagold Trading Bot

Task-based trading bot platform.

## Core model
A bot task is identified by:
- `portfolio_id`
- `market`
- `strategy`
- `user_id`

A deterministic `task_id` is generated from this tuple.

## Notes
- Each active bot creates its own WS/session using saved auth cookies/headers.
- Streams can be chosen per task using `metadata.ws_streams`.
- Current focus is `run_mode=simulator`.

## Quick API list (gateway)
- `POST /login`
- `POST /logout`
- `POST /bots/create`
- `POST /bots/start`
- `POST /bots/stop`
- `POST /bots/remove`
- `POST /tasks/status`
- `POST /tasks/logs`

See detailed curl flows in:
- `workers/api_server/README.md`
- `workers/bot_trading_worker/README.md`
