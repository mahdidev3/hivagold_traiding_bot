# Bot Simulator Worker

## What this worker does

`bot_simulator_worker` manages simulation tasks shaped as `<portfolio-user-market>`.  
Each task has:
- a unique `task_id`
- a dedicated runtime thread (`sim-task-<task_id>`) for websocket market updates
- initial/available units
- many positions, each with unique `position_id`

All tasks and positions are logged as structured JSON files under:
- `USERS_STORAGE_DIR/simulator/tasks/*.json`
- `USERS_STORAGE_DIR/simulator/positions/*.json`

Supported markets: `mazaneh`, `ounce`, `mazaneh_xag`, `xag`.

## Authentication

All endpoints except `GET /health` require:

```http
x-api-key: <BOT_API_KEY>
```

## APIs

### `POST /simulator/tasks`
Create `<portfolio-user-market>` simulation task.

```json
{
  "portfolio_id": "portfolio-0912",
  "user_id": "09123456789",
  "market": "xag",
  "domain": "https://hivagold.com",
  "initial_units": 100
}
```

### `POST /simulator/tasks/{task_id}/close`
Close a task.

### `POST /simulator/tasks/{task_id}/positions`
Create position in a task.

```json
{
  "strategy": "ema_wall_v1",
  "side": "buy",
  "entry_type": "market",
  "entry_price": 31.2,
  "take_profit": 32.0,
  "stop_loss": 30.7,
  "units": 1.0
}
```

### `PATCH /simulator/positions/{position_id}`
Update a position.

### `POST /simulator/positions/{position_id}/stop-loss`
Change stop loss only.

### `POST /simulator/positions/{position_id}/close`
Close position.

### `POST /simulator/price`
Feed market price tick.

```json
{
  "task_id": "portfolio-0912-09123456789-xag-ab12cd34",
  "market": "xag",
  "price": 31.85
}
```

### `GET /simulator/tasks/{task_id}`
Get task with all its positions.

### `GET /simulator/db/records`
Get full simulator storage view.

## Notes

- Websocket price stream is opened per task when `domain` is provided.
- WS path template is configurable by `WS_PRICE_PATH_TEMPLATE` (default: `/{market}/ws/{market}/price/`).
