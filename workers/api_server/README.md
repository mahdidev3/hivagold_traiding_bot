# API Server Worker

Public gateway for auth and trading task bot operations.

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

## Full test example (curl)

```bash
# login first (to save cookies/headers in auth storage)
curl -X POST http://localhost:8000/login \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass","base_domain":"https://hivagold.com"}'

# create bot
curl -X POST http://localhost:8000/bots/create \
  -H 'Content-Type: application/json' \
  -d '{
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
      "ws_streams":["price","wall"]
    }
  }'

# start bot by id
curl -X POST http://localhost:8000/bots/start \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-xxxxxxxxxxxx"}'

# get task status
curl -X POST http://localhost:8000/tasks/status \
  -H 'Content-Type: application/json' \
  -d '{"task_id":"task-xxxxxxxxxxxxxxxx"}'

# get task logs
curl -X POST http://localhost:8000/tasks/logs \
  -H 'Content-Type: application/json' \
  -d '{"task_id":"task-xxxxxxxxxxxxxxxx"}'
```
