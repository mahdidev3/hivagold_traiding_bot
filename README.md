# Hivagold Trading Bot (Microservices)

This repository contains a Python/FastAPI-based microservice system for Hivagold automation:

- **API Server**: single public entrypoint that routes requests to worker services.
- **Bot Auth Worker**: login/logout + captcha/auth cookie flow.
- **Bot Captcha Worker**: captcha solving service.
- **Bot Room Worker**: room/portfolio/order/transaction operations.
- **Bot Trading Worker**: signal generation + websocket signal streaming.
- **Bot Portfolio Worker**: portfolio rule engine + order execution with TP/SL tracking.
- **Redis Worker**: shared state/cache.

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
- **bot_trading_worker**: market signal generation and websocket signal broadcasting.
- **bot_captcha_worker**: dedicated captcha solving endpoint used by auth flow.
- **bot_portfolio_worker**: executes buy/sell orders from rules and bot API, and stores user pnl/win-rate stats.
- **redis_worker**: shared cache/session store used by all workers.

## Prerequisites

- Python **3.11+**
- Docker + Docker Compose
- kubectl (for Kubernetes deployments)
- (Minikube only) minikube + ingress addon
- (Optional) PowerShell for `manage.ps1` helper scripts

---

## All Useful Commands

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
# terminal 1
cd workers/bot_captcha_worker && python run.py

# terminal 2
cd workers/bot_auth_worker && python run.py

# terminal 3
cd workers/bot_room_worker && python run.py

# terminal 4
cd workers/bot_trading_worker && python run.py

# terminal 5
cd workers/bot_portfolio_worker && python run.py

# terminal 6
cd workers/api_server && python run.py
```

> Redis must also be running (locally or via Docker) and reachable by workers.

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

### API server

```bash
cd workers/api_server
docker compose up -d
docker compose logs -f api-server
docker compose down
```

### Portfolio worker

```bash
cd workers/bot_portfolio_worker
docker compose up -d
docker compose logs -f portfolio-worker
docker compose down
```

---

## 4) PowerShell helper commands

Every worker folder provides `manage.ps1` with the same actions:

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

Room status (**requires a logged-in mobile because it uses stored cookies + headers from Redis**):

```bash
curl -X POST http://localhost:8000/room/status \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

Room actions (`portfolios`, `orders`, `order-create`, `order-close`, `transactions`, `transaction-close`, `portfolio-close`, `portfolio-create`) also require a valid login session for the same mobile:

```bash
curl -X POST http://localhost:8000/room/orders \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

Create active portfolio:

```bash
curl -X POST http://localhost:8000/portfolio/create \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'

# equivalent dynamic room action route
curl -X POST http://localhost:8000/room/portfolio-create \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

---

## 6) Kubernetes deployment (Minikube and other clusters)

All Kubernetes manifests are in `k8s/base`.

### A) What is included

- Namespace (`hivagold`)
- Shared ConfigMap (`hivagold-config`)
- Shared Secret (`hivagold-secrets`)
- Redis (PVC + Deployment + Service)
- Deployments + Services for all app workers
- Ingress (`api.hivagold.local` → `api-server`)
- ExternalName service (`hivagold-main-api`) for DNS-style CNAME mapping

### B) Local image requirement before Kubernetes operations

Before running `apply`, `update`, or any rollout operation, required container images must exist locally in Docker Desktop.

- `k8s/manage.ps1` reads each worker `.env` `APP_VERSION`
- It updates manifest image tags with `sync-images`
- It verifies local images and (for Minikube context) loads them with `minikube image load`
- This enables local/offline-style deployment flow without internet pulls (assuming images are already present locally)

### C) Build images locally (Docker Desktop)

```bash
docker build -t hivagold-api-server:<APP_VERSION> workers/api_server
docker build -t bot-auth-worker:<APP_VERSION> workers/bot_auth_worker
docker build -t bot-captcha-worker:<APP_VERSION> workers/bot_captcha_worker
docker build -t bot-room-worker:<APP_VERSION> workers/bot_room_worker
docker build -t bot-trading-worker:<APP_VERSION> workers/bot_trading_worker
```

> Replace `<APP_VERSION>` with the value in each worker `.env` file.

### D) `k8s/manage.ps1` actions and examples (full)

```powershell
./k8s/manage.ps1 help
```

Actions:

- `sync-images` → update `k8s/base/*.yaml` image tags from `.env`
- `load-images` → verify local Docker images and load into Minikube when context is Minikube
- `prepare` → `sync-images` + `load-images`
- `apply` → prepare and apply manifests
- `update` → prepare and apply specific target
- `delete` → delete all/single target manifests
- `get-all` → show all resources in `hivagold` namespace
- `check-all` → deployments/pods/services/ingress overview
- `status` → rollout status for all/single deployment
- `help` → usage

Targets:

- `all` (default)
- `api-server`
- `bot-auth-worker`
- `bot-captcha-worker`
- `bot-room-worker`
- `bot-trading-worker`

Examples:

```powershell
# Sync only
./k8s/manage.ps1 sync-images all
./k8s/manage.ps1 sync-images api-server

# Local image check/load only
./k8s/manage.ps1 load-images all
./k8s/manage.ps1 load-images bot-auth-worker

# Prepare (sync + load)
./k8s/manage.ps1 prepare all
./k8s/manage.ps1 prepare bot-room-worker

# Apply/update
./k8s/manage.ps1 apply all
./k8s/manage.ps1 update bot-trading-worker

# Inspect rollout
./k8s/manage.ps1 get-all
./k8s/manage.ps1 check-all
./k8s/manage.ps1 status all
./k8s/manage.ps1 status api-server

# Delete
./k8s/manage.ps1 delete bot-captcha-worker
./k8s/manage.ps1 delete all
```

### E) Minikube ingress setup

```bash
minikube addons enable ingress
kubectl get ingress -n hivagold
minikube ip
```

Add this to your `/etc/hosts` (or Windows hosts file), replacing `<MINIKUBE_IP>`:

```text
<MINIKUBE_IP> api.hivagold.local
```

Then test:

```bash
curl http://api.hivagold.local/health
```

### F) Quick access without ingress (port-forward)

```bash
kubectl -n hivagold port-forward svc/api-server 8000:8000
curl http://127.0.0.1:8000/health
```

### G) Deploying to other clusters (EKS/GKE/AKS/on-prem)

1. Push images to your registry (for example `registry.example.com/hivagold/...`).
2. Update image references in the Deployment manifests under `k8s/base/*.yaml`.
3. Replace `REDIS_PASSWORD` in `k8s/base/secret.yaml`.
4. (Optional but recommended) attach a StorageClass to `redis-data` PVC for persistent Redis storage.
5. Configure your ingress controller/class and hostnames/TLS certificates.
6. Apply manifests:

```bash
kubectl apply -k k8s/base
kubectl rollout status deployment/api-server -n hivagold
kubectl get pods -n hivagold
```

### H) Useful Kubernetes operations

```bash
kubectl get pods -n hivagold
kubectl logs -n hivagold deployment/api-server
kubectl logs -n hivagold deployment/bot-auth-worker
kubectl describe pod -n hivagold <pod-name>
kubectl delete -k k8s/base
```

More room examples:

```bash
# create order
curl -X POST http://localhost:8000/room/order-create \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag","payload":{"order_type":"market","action":"buy","units":1}}'

# close order
curl -X POST http://localhost:8000/room/order-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag","payload":{"order_id":"12345"}}'

# list transactions
curl -X POST http://localhost:8000/room/transactions \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag"}'

# close transaction
curl -X POST http://localhost:8000/room/transaction-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag","payload":{"transaction_id":"987"}}'

# close portfolio
curl -X POST http://localhost:8000/room/portfolio-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"0912xxxxxxx","base_domain":"https://demo.hivagold.com","market":"xag","payload":{"portfolio_id":"456"}}'
```

---


### Endpoint summary (API Server)

- `GET /health`
- `POST /login`
- `POST /logout`
- `GET /signals/latest`
- `POST /portfolio/create`
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

Each service reads environment variables from its `config.py` and its `.env` (when started via Docker Compose).

Important ones:

- Shared:
  - `ENVIRONMENT`
  - `APP_NAME`
  - `APP_VERSION`
  - `REDIS_HOST`
  - `REDIS_PORT`
  - `REDIS_PASSWORD`
- API server:
  - `API_SERVER_HOST`, `API_SERVER_PORT`
  - `AUTH_WORKER_URL`, `ROOM_WORKER_URL`, `TRADING_WORKER_URL`
  - `DEFAULT_MARKET`
- Auth worker:
  - `AUTH_WORKER_HOST`, `AUTH_WORKER_PORT`
  - `BASE_DOMAIN`
  - `LOGIN_PATH`, `CAPTCHA_INFO_PATH`, `CAPTCHA_IMAGE_BASE_PATH`, `VERIFY_CAPTCHA_PATH`, `COOKIES_VALIDATION_PATH`
- Captcha worker:
  - `CAPTCHA_WORKER_HOST`, `CAPTCHA_WORKER_PORT`
  - `CAPTCHA_CODE_LENGTH`, `CAPTCHA_SOLVER_MAX_RETRY`
- Room worker:
  - `ROOM_WORKER_HOST`, `ROOM_WORKER_PORT`
  - `BASE_DOMAIN`, `ROOM_PREFIX`, `HIVAGOLD_TENANT_ID`
- Trading worker:
  - `TRADING_WORKER_HOST`, `TRADING_WORKER_PORT`
  - `TRADING_USERS_JSON_PATH`
  - `TRADING_ROOM_PREFIX`
  - `WS_LIVE_BARS_PATH`, `WS_PRICE_PATH`, `WS_WALL_PATH`, `BARS_API_PATH`
  - `TRADING_AUTO_START`

---

## Deployment Guide

## Option A: Single VM with Docker Compose (recommended for this repo)

1. **Clone repository** on server.
2. **Create `.env` files** inside each worker directory (`workers/*/.env`) with correct hostnames, ports, and secrets.
3. **Create docker network** once:

```bash
docker network create hivagold || true
```

4. **Start Redis first**:

```bash
cd workers/redis_worker && docker compose up -d
```

5. **Start internal workers**:

```bash
cd workers/bot_captcha_worker && docker compose up -d
cd workers/bot_auth_worker && docker compose up -d
cd workers/bot_room_worker && docker compose up -d
cd workers/bot_trading_worker && docker compose up -d
```

6. **Start API server**:

```bash
cd workers/api_server && docker compose up -d
```

7. **Verify health endpoints**:

```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8005/health
curl http://localhost:8006/health
curl http://localhost:8000/health
```

8. **Optional reverse proxy** (Nginx/Caddy) in front of API server (`:8000`) for TLS + domain routing.

9. **Operations**:

```bash
docker ps
cd workers/api_server && docker compose logs -f
```

## Option B: Container platform (Kubernetes/ECS/Nomad)

Use each worker’s Dockerfile as an independent service image and map env vars 1:1 from current `config.py` settings. Expose only API server publicly; keep Redis + internal workers private.

---

## Health Endpoints

- `GET /health` exists in every HTTP service:
  - Captcha worker: `:8001/health`
  - Auth worker: `:8002/health`
  - Room worker: `:8005/health`
  - Trading worker: `:8006/health`
  - API server: `:8000/health`

---

## Notes

- `workers/bot_trading_worker/users.json` is mounted as read-only in Docker Compose.
- Trading worker supports websocket streaming on `/signals/ws`.
- Keep secrets in `.env` or your secret manager; do not hardcode credentials.
