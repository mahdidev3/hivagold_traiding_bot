# Hivagold Trading Bot

Monorepo for Hivagold trading automation services (FastAPI workers + gateway API + docker-compose per worker + Kubernetes manifests).

## Services and ports

| Service | Port | Description |
|---|---:|---|
| `api_server` | `8000` | Public gateway API (auth + room + portfolio/simulator proxy) |
| `bot_captcha_worker` | `8001` | Captcha solver worker |
| `bot_auth_worker` | `8002` | Login/logout and session cookie management |
| `bot_room_worker` | `8005` | Room/portfolio/order/transaction operations |
| `bot_trading_worker` | `8006` | Bot runtime and bot activation management |
| `bot_simulator_worker` | `8007` | Portfolio simulator database and PnL processing |

---

## Quick start (local Python)

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip

pip install -r workers/api_server/requirements.txt
pip install -r workers/bot_auth_worker/requirements.txt
pip install -r workers/bot_captcha_worker/requirements.txt
pip install -r workers/bot_room_worker/requirements.txt
pip install -r workers/bot_trading_worker/requirements.txt
pip install -r workers/bot_simulator_worker/requirements.txt
pip install pytest
```

Run Redis (required by auth/room flow):

```bash
docker run --rm -p 6379:6379 --name hivagold-redis redis:7
```

Run workers (one terminal per worker):

```bash
cd workers/bot_captcha_worker && python run.py
cd workers/bot_auth_worker && python run.py
cd workers/bot_room_worker && python run.py
cd workers/bot_trading_worker && python run.py
cd workers/bot_simulator_worker && python run.py
cd workers/api_server && python run.py
```

---

## Doctor (project maintenance helper)

A root-level doctor script is included to help with diagnostics, update from git, and restart workers.

- Linux/macOS: `./doctor.sh`
- Windows PowerShell: `./doctor.ps1`

### Doctor features

- Validate required commands (`git`, `python`, `docker`, `curl`)
- Check repository branch and worker management scripts
- Check worker `/health` endpoints
- Update code from this repository: `https://github.com/mahdidev3/hivagold_traiding_bot.git`
- Restart all workers automatically after update
- Start/stop/build/restart/status/logs across all workers or one target worker

### Doctor usage

```bash
./doctor.sh doctor
./doctor.sh update
./doctor.sh build all
./doctor.sh start all
./doctor.sh restart all
./doctor.sh status all
./doctor.sh logs api_server
```

PowerShell:

```powershell
./doctor.ps1 doctor
./doctor.ps1 update
./doctor.ps1 restart all
./doctor.ps1 status bot_trading_worker
```

Targets supported by doctor:

- `all`
- `api_server`
- `bot_captcha_worker`
- `bot_auth_worker`
- `bot_room_worker`
- `bot_trading_worker`
- `bot_simulator_worker`

---

## API gateway (`api_server`) endpoints

Base URL: `http://localhost:8000`

### Health
- `GET /health`

Example:
```bash
curl http://localhost:8000/health
```

### Auth
- `POST /login`
- `POST /logout`

Examples:
```bash
curl -X POST http://localhost:8000/login -H 'Content-Type: application/json' -d '{"mobile":"09123456789","password":"pass"}'
curl -X POST http://localhost:8000/logout -H 'Content-Type: application/json' -d '{"mobile":"09123456789"}'
```

### Room endpoints
- `POST /room/status`
- `POST /room/portfolios`
- `POST /room/portfolio-create`
- `POST /room/orders`
- `POST /room/order-create`
- `POST /room/order-close`
- `POST /room/transactions`
- `POST /room/transaction-close`
- `POST /room/portfolio-close`

> `POST /room/{action_name}` maps action names to room worker endpoints.

Examples:
```bash
curl -X POST http://localhost:8000/room/status -H 'Content-Type: application/json' -d '{"mobile":"09123456789","market":"xag"}'

curl -X POST http://localhost:8000/room/orders -H 'Content-Type: application/json' -d '{"mobile":"09123456789","payload":{}}'

curl -X POST http://localhost:8000/room/order-create -H 'Content-Type: application/json' -d '{"mobile":"09123456789","payload":{"order_type":"market","action":"buy","units":1,"take_profit":3500,"stop_loss":3200}}'
```

### Portfolio/simulator proxy endpoints
- `POST /portfolio/rules`
- `POST /portfolio/orders`
- `POST /portfolio/orders/bot`
- `POST /portfolio/price`
- `GET /portfolio/users/{user_id}/stats`
- `GET /portfolio/db/records`
- `GET /portfolio/strategies/{strategy}/pnl-positions`
- `GET /admin/db/all` (requires header `x-admin-key`)

Examples:
```bash
curl -X POST http://localhost:8000/portfolio/rules -H 'Content-Type: application/json' -d '{"user_id":"09123456789","rule":{"max_positions":2}}'

curl -X POST http://localhost:8000/portfolio/orders -H 'Content-Type: application/json' -d '{"user_id":"09123456789","side":"buy","entry_type":"market","take_profit":3500,"stop_loss":3200,"volume":1}'

curl -X POST http://localhost:8000/portfolio/price -H 'Content-Type: application/json' -d '{"symbol":"xag","price":3375.2}'

curl http://localhost:8000/portfolio/users/09123456789/stats
curl http://localhost:8000/portfolio/db/records
curl http://localhost:8000/portfolio/strategies/manual/pnl-positions
curl -H 'x-admin-key: your-admin-key' http://localhost:8000/admin/db/all
```

---

## Direct worker endpoints

## `bot_captcha_worker` (`http://localhost:8001`)
- `GET /health`
- `POST /solve`

Examples:
```bash
curl http://localhost:8001/health
curl -X POST http://localhost:8001/solve -H 'Content-Type: application/json' -d '{"image_url":"https://example.com/captcha.jpg"}'
```

## `bot_auth_worker` (`http://localhost:8002`)
- `GET /health`
- `POST /login`
- `POST /logout`

Examples:
```bash
curl http://localhost:8002/health
curl -X POST http://localhost:8002/login -H 'Content-Type: application/json' -d '{"mobile":"09123456789","password":"pass"}'
curl -X POST http://localhost:8002/logout -H 'Content-Type: application/json' -d '{"mobile":"09123456789"}'
```

## `bot_room_worker` (`http://localhost:8005`)
- `GET /health`
- `POST /room/status`
- `POST /room/portfolios`
- `POST /room/portfolio/create`
- `POST /room/orders`
- `POST /room/order/create`
- `POST /room/order/close`
- `POST /room/transactions`
- `POST /room/transaction/close`
- `POST /room/portfolio/close`

Examples:
```bash
curl http://localhost:8005/health
curl -X POST http://localhost:8005/room/status -H 'Content-Type: application/json' -d '{"mobile":"09123456789","market":"xag"}'
curl -X POST http://localhost:8005/room/order/create -H 'Content-Type: application/json' -d '{"mobile":"09123456789","order_type":"market","action":"buy","units":1,"take_profit":3500,"stop_loss":3200}'
curl -X POST http://localhost:8005/room/order/close -H 'Content-Type: application/json' -d '{"mobile":"09123456789","order_id":"12345"}'
```

## `bot_trading_worker` (`http://localhost:8006`)
- `GET /health`
- `POST /trading/process`

Supported actions for `/trading/process`:
- `start`
- `stop`
- `status`
- `list_bots`
- `activate_bot` (use `bot_id` or `mobile` + `domain`)
- `deactivate_bot` (use `bot_id` or `mobile` + `domain`)

Examples:
```bash
curl http://localhost:8006/health
curl -X POST http://localhost:8006/trading/process -H 'Content-Type: application/json' -d '{"action":"start"}'
curl -X POST http://localhost:8006/trading/process -H 'Content-Type: application/json' -d '{"action":"status"}'
curl -X POST http://localhost:8006/trading/process -H 'Content-Type: application/json' -d '{"action":"activate_bot","mobile":"09123456789","domain":"https://hivagold.com"}'
```

## `bot_simulator_worker` (`http://localhost:8007`)
All endpoints except `/health` require header `x-api-key: <BOT_API_KEY>`.

- `GET /health`
- `POST /portfolio/orders`
- `PATCH /portfolio/users/{mobile}/positions/{position_id}`
- `POST /portfolio/users/{mobile}/positions/{position_id}/close`
- `POST /portfolio/price`
- `GET /portfolio/users/{mobile}/stats`
- `GET /portfolio/users/{mobile}/history`
- `GET /portfolio/db/records`
- `GET /portfolio/strategies/{strategy}/pnl-positions`
- `GET /portfolio/admin/db`

Examples:
```bash
curl http://localhost:8007/health
curl -X POST http://localhost:8007/portfolio/orders -H 'x-api-key: your-bot-api-key' -H 'Content-Type: application/json' -d '{"mobile":"09123456789","side":"buy","entry_type":"market","take_profit":3500,"stop_loss":3200,"volume":1}'

curl -X PATCH http://localhost:8007/portfolio/users/09123456789/positions/1 -H 'x-api-key: your-bot-api-key' -H 'Content-Type: application/json' -d '{"take_profit":3600}'

curl -X POST http://localhost:8007/portfolio/users/09123456789/positions/1/close -H 'x-api-key: your-bot-api-key' -H 'Content-Type: application/json' -d '{"reason":"manual"}'

curl -X POST http://localhost:8007/portfolio/price -H 'x-api-key: your-bot-api-key' -H 'Content-Type: application/json' -d '{"mobile":"09123456789","price":3399.1,"symbol":"xag"}'

curl -H 'x-api-key: your-bot-api-key' http://localhost:8007/portfolio/users/09123456789/stats
curl -H 'x-api-key: your-bot-api-key' http://localhost:8007/portfolio/users/09123456789/history
curl -H 'x-api-key: your-bot-api-key' http://localhost:8007/portfolio/db/records
curl -H 'x-api-key: your-bot-api-key' http://localhost:8007/portfolio/strategies/manual/pnl-positions
curl -H 'x-api-key: your-bot-api-key' http://localhost:8007/portfolio/admin/db
```

---

## API Server CLI helper

A simple CLI exists at `workers/api_server/cli.py`:

```bash
python workers/api_server/cli.py --server http://localhost:8000 login --mobile 09123456789 --password pass
python workers/api_server/cli.py --server http://localhost:8000 room-status --mobile 09123456789 --market xag
python workers/api_server/cli.py --server http://localhost:8000 room order-create --mobile 09123456789 --action-side buy --order-type market --units 1 --take-profit 3500 --stop-loss 3200
```

---

## Kubernetes

Kubernetes manifests and helper script are in `k8s/`.

- Main helper: `k8s/manage.ps1`
- Docs: `k8s/README.md`

---

## Tests

```bash
pytest -q
```
