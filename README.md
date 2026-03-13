# Hivagold Trading Bot (Microservices)

This repository contains a Python/FastAPI-based microservice system for Hivagold automation:

- **API Server**: single public entrypoint for auth/room/signal APIs.
- **Bot Auth Worker**: login/logout + captcha/auth cookie flow.
- **Bot Captcha Worker**: captcha solving service.
- **Bot Room Worker**: room/portfolio/order/transaction operations.
- **Bot Trading Worker**: websocket-driven market state + modular strategy signals.
- **Bot Portfolio Worker**: strategy tester that consumes Redis events and tracks strategy PnL/win-rate history.
- **Redis Worker**: shared state/cache + event bus.

---

## Project Structure

```text
workers/
  api_server/
  bot_auth_worker/
  bot_captcha_worker/
  bot_room_worker/
  bot_trading_worker/
  bot_portfolio_worker/
  redis_worker/
tests/
```

---

## Service Responsibilities

- **api_server**: public HTTP API, request validation, and queue-based dispatch to workers.
- **bot_auth_worker**: login/logout session handling and captcha verification flow.
- **bot_room_worker**: portfolio/order/transaction management endpoints against Hivagold room APIs.
- **bot_trading_worker**: keeps existing `price`/`live-bars`/`wall` websocket streams, runs enabled strategy modules, publishes signals + market events.
- **bot_captcha_worker**: dedicated captcha solving endpoint used by auth flow.
- **bot_portfolio_worker**: strategy tester (per-strategy virtual portfolio) that consumes Redis events and stores trade history + win rate + pnl.
- **redis_worker**: shared cache/session store and worker-to-worker event channel.

---

## Prerequisites

- Python **3.11+**
- Docker + Docker Compose
- kubectl (for Kubernetes deployments)
- (Minikube only) minikube + ingress addon
- (Optional) PowerShell for `manage.ps1` helper scripts

---

## 1) Local Python setup

From repo root:

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
pip install -r workers/api_server/requirements.txt
pip install -r workers/bot_auth_worker/requirements.txt
pip install -r workers/bot_captcha_worker/requirements.txt
pip install -r workers/bot_room_worker/requirements.txt
pip install -r workers/bot_trading_worker/requirements.txt
pip install -r workers/bot_portfolio_worker/requirements.txt
pip install pytest
```

Run tests:

```bash
pytest -q
```

---

## 2) Run services locally (without Docker)

Use one terminal per service.

```bash
# terminal 1 (redis required)
docker run --rm -p 6379:6379 --name hivagold-redis redis:7

# terminal 2
cd workers/bot_captcha_worker && python run.py

# terminal 3
cd workers/bot_auth_worker && python run.py

# terminal 4
cd workers/bot_room_worker && python run.py

# terminal 5
cd workers/bot_trading_worker && python run.py

# terminal 6
cd workers/bot_portfolio_worker && python run.py

# terminal 7
cd workers/api_server && python run.py
```

> For Docker deployments, set `REDIS_HOST=redis` (service DNS on bridge network), not localhost.

---

## 3) Docker Compose commands per service

Each worker folder has its own `docker-compose.yaml`.

### Redis

```bash
cd workers/redis_worker
docker compose up -d
docker compose logs -f redis
docker compose down
```

### Captcha worker

```bash
cd workers/bot_captcha_worker
docker compose up -d
docker compose logs -f captcha-worker
docker compose down
```

### Auth worker

```bash
cd workers/bot_auth_worker
docker compose up -d
docker compose logs -f auth-worker
docker compose down
```

### Room worker

```bash
cd workers/bot_room_worker
docker compose up -d
docker compose logs -f room-worker
docker compose down
```

### Trading worker

```bash
cd workers/bot_trading_worker
docker compose up -d
docker compose logs -f trading-worker
docker compose down
```

### Portfolio worker

```bash
cd workers/bot_portfolio_worker
docker compose up -d
docker compose logs -f portfolio-worker
docker compose down
```

### API server

```bash
cd workers/api_server
docker compose up -d
docker compose logs -f api-server
docker compose down
```

---

## 4) PowerShell helper commands

Every worker folder provides `manage.ps1` with actions:

- `build`
- `up`
- `down`
- `restart`
- `logs`
- `all`
- `volumes`
- `volumes-rm`
- `volume-rm -VolumeName <name>`

Example:

```powershell
cd workers/bot_auth_worker
./manage.ps1 -Action up
./manage.ps1 -Action logs
```

---

## 5) API usage commands

After API server is up (`http://localhost:8000` by default):

Health:

```bash
curl http://localhost:8000/health
```

Login:

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","password":"your-password","base_domain":"https://demo.hivagold.com"}'
```

Logout:

```bash
curl -X POST http://localhost:8000/logout \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com"}'
```

Latest signals:

```bash
curl http://localhost:8000/signals/latest
```

Room status:

```bash
curl -X POST http://localhost:8000/room/status \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

Room orders:

```bash
curl -X POST http://localhost:8000/room/orders \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

### Portfolio Strategy Tester API (direct worker)

Portfolio worker is queue-based and currently uses:

`POST http://localhost:8007/portfolio/process`

```bash
curl -X POST http://localhost:8007/portfolio/process \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"action":"status","payload":{}}'
```

List discovered strategies:

```bash
curl -X POST http://localhost:8007/portfolio/process \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"action":"list_strategies","payload":{}}'
```

Get strategy stats:

```bash
curl -X POST http://localhost:8007/portfolio/process \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"action":"strategy_stats","payload":{"strategy":"ema_wall_v1"}}'
```

---

## Endpoint summary (API Server)

- `GET /health`
- `POST /login`
- `POST /logout`
- `GET /signals/latest`
- `POST /room/status`
- `POST /room/portfolios`
- `POST /room/orders`
- `POST /room/order-create`
- `POST /room/order-close`
- `POST /room/transactions`
- `POST /room/transaction-close`
- `POST /room/portfolio-close`
- `POST /room/portfolio-create`

## 6) Built-in API CLI commands

The API server includes `workers/api_server/cli.py`:

```bash
cd workers/api_server
python cli.py --help
python cli.py login --mobile 0912xxxxxxx --password your-password
python cli.py logout --mobile 0912xxxxxxx
python cli.py signals --latest
python cli.py room-status --mobile 0912xxxxxxx --base-domain https://demo.hivagold.com --market xag
python cli.py room portfolios --mobile 0912xxxxxxx
python cli.py room orders --mobile 0912xxxxxxx
python cli.py room order-create --mobile 0912xxxxxxx --action-side buy --order-type market --units 1
python cli.py room order-close --mobile 0912xxxxxxx --order-id <id>
python cli.py room transactions --mobile 0912xxxxxxx
python cli.py room transaction-close --mobile 0912xxxxxxx --transaction-id <id>
python cli.py room portfolio-close --mobile 0912xxxxxxx --portfolio-id <id>
python cli.py room portfolio-create --mobile 0912xxxxxxx
```

---

## Environment Variables

Each service reads environment variables from its `config.py` and `.env`.

Important ones:

- Shared:
  - `ENVIRONMENT`
  - `APP_NAME`
  - `APP_VERSION`
  - `REDIS_HOST`
  - `REDIS_PORT`
  - `REDIS_PASSWORD`
- Trading worker:
  - `TRADING_WORKER_HOST`, `TRADING_WORKER_PORT`
  - `TRADING_USERS_JSON_PATH`
  - `WS_LIVE_BARS_PATH`, `WS_PRICE_PATH`, `WS_WALL_PATH`, `BARS_API_PATH`
  - `ENABLE_STRATEGY_EMA_WALL_V1`
  - `REDIS_MARKET_EVENT_CHANNEL`
- Portfolio worker:
  - `PORTFOLIO_WORKER_HOST`, `PORTFOLIO_WORKER_PORT`
  - `BOT_API_KEY`
  - `DATABASE_PATH`
  - `REDIS_HOST`, `REDIS_PORT`, `REDIS_MARKET_EVENT_CHANNEL`

---

## Notes

- `workers/bot_trading_worker/users.json` is mounted read-only in Docker Compose.
- Trading worker supports websocket streaming on `/signals/ws`.
- Portfolio worker is strategy-centric (not per-user) and consumes Redis events from trading worker.
- Keep secrets in `.env` or a secret manager; do not hardcode credentials.
