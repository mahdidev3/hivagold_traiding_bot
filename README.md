# Hivagold Trading Bot

Monorepo for Hivagold trading automation services (FastAPI workers + gateway API + Kubernetes manifests).

## Services overview

| Service | Default Port | Responsibility |
|---|---:|---|
| `api_server` | `8000` | Public gateway that proxies auth, room, and simulator/portfolio APIs |
| `bot_captcha_worker` | `8001` | Downloads captcha images and extracts captcha codes |
| `bot_auth_worker` | `8002` | Login/logout flow and persisted session/cookie handling |
| `bot_room_worker` | `8005` | Room operations (`status`, `portfolios`, `orders`, `transactions`) |
| `bot_trading_worker` | `8006` | Multi-bot runtime (`start/stop/status`, activate/deactivate bot) |
| `bot_simulator_worker` | `8007` | File-based portfolio simulator used by strategy and API flows |

---

## Local development

From repo root:

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

## Run locally

Start Redis (needed by auth/room flows):

```bash
docker run --rm -p 6379:6379 --name hivagold-redis redis:7
```

Run workers (one terminal per service):

```bash
cd workers/bot_captcha_worker && python run.py
cd workers/bot_auth_worker && python run.py
cd workers/bot_room_worker && python run.py
cd workers/bot_trading_worker && python run.py
cd workers/bot_simulator_worker && python run.py
cd workers/api_server && python run.py
```

Gateway URL: `http://localhost:8000`

---

## API gateway (`workers/api_server`)

### Health
- `GET /health`

### Auth proxy
- `POST /login`
- `POST /logout`

### Room endpoints
- `POST /room/status`
- `POST /room/{action_name}` where `action_name` is:
  - `portfolios`
  - `portfolio-create`
  - `orders`
  - `order-create`
  - `order-close`
  - `transactions`
  - `transaction-close`
  - `portfolio-close`

### Portfolio/simulator endpoints
- `POST /portfolio/rules`
- `POST /portfolio/orders`
- `POST /portfolio/orders/bot`
- `POST /portfolio/price`
- `GET /portfolio/users/{user_id}/stats`
- `GET /portfolio/db/records`
- `GET /portfolio/strategies/{strategy}/pnl-positions`
- `GET /admin/db/all` (requires header `x-admin-key`)

---

## Worker endpoints (direct)

### `bot_captcha_worker` (`:8001`)
- `GET /health`
- `POST /solve`

### `bot_auth_worker` (`:8002`)
- `GET /health`
- `POST /login`
- `POST /logout`

### `bot_room_worker` (`:8005`)
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

### `bot_trading_worker` (`:8006`)
- `GET /health`
- `POST /trading/process`
  - actions: `start`, `stop`, `status`, `list_bots`, `activate_bot`, `deactivate_bot`

### `bot_simulator_worker` (`:8007`)
All endpoints except `/health` require `x-api-key: <BOT_API_KEY>`.

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

---

## Tests

```bash
pytest -q
```
