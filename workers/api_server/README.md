# API Server Worker

## Purpose

`api_server` is the public gateway. It forwards:
- auth requests to `bot_auth_worker`
- trading/task bot requests to `bot_trading_worker`

Base URL: `http://localhost:8000`

## Endpoints

- `GET /health`
- `POST /login`
- `POST /logout`
- `POST /bots/create`
- `POST /bots/remove`
- `POST /bots/start`
- `POST /bots/stop`
- `POST /tasks/status`
- `POST /tasks/logs`

## Bot create payload

```json
{
  "user_id": "user-1",
  "portfolio_id": "portfolio-1",
  "market": "xag",
  "strategy": "ema_wall_v1",
  "simulator_task_id": "sim-task-1",
  "mobile": "09123456789",
  "password": "pass",
  "domain": "https://hivagold.com",
  "run_mode": "simulator",
  "active": false,
  "metadata": {
    "external_source": "signal-provider-a"
  }
}
```

Use `/tasks/status` and `/tasks/logs` with:

```json
{
  "task_id": "task-xxxxxxxxxxxxxxxx"
}
```
