# Bot Trading Worker

Bot Trading Worker now runs bots directly (without Redis signals/pubsub).

## What it keeps
- Hivagold market data API + websocket usage (`live-bars`, `price`, `wall`).
- Loading user headers/cookies from JSON session files.
- Base runtime for strategy execution per activated bot.

## What changed
- Redis is fully removed.
- Added optional second/external price websocket (`WS_EXTERNAL_PRICE_URL`).
- Each activated bot runs in its own async task context with:
  - `mobile`
  - `strategy`
  - `room`
  - `run_mode` (`simulator` or `real`)
- Simulator is integrated via API (`/portfolio/price`) when run mode is `simulator`.
- No signal generation/publishing is done anymore; worker emits internal bot events only.

## API
- `POST /trading/process`
  - `start`, `stop`, `status`, `list_bots`, `activate_bot`, `deactivate_bot`
- `GET /signals/latest` (latest bot events)
- `WS /signals/ws` (stream bot events)

## Bot config (`users.json`)
```json
[
  {
    "mobile": "0912...",
    "password": "...",
    "domain": "https://hivagold.com",
    "strategy": "your_strategy_name",
    "room": "xag",
    "run_mode": "simulator",
    "active": true,
    "metadata": {}
  }
]
```
