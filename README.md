# Hivagold Trading Bot — Local Mode Guide

This README is focused on **running everything locally with Python** and using **one shared `.venv`** for the whole project.

---

## 1) Create one `.venv` for the whole project

From repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Install all worker dependencies into the same environment:

```bash
pip install -r workers/api_server/requirements.txt
pip install -r workers/bot_auth_worker/requirements.txt
pip install -r workers/bot_captcha_worker/requirements.txt
pip install -r workers/bot_room_worker/requirements.txt
pip install -r workers/bot_trading_worker/requirements.txt
pip install -r workers/bot_simulator_worker/requirements.txt
pip install pytest
```

> You only need this one `.venv` at repo root. Do **not** create separate virtual environments inside each worker.

---

## 2) Run in local mode (Python only)

Start Redis (required by workers):

```bash
docker run --rm -p 6379:6379 --name hivagold-redis redis:7
```

Then open one terminal per service (with `.venv` activated):

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
cd workers/bot_simulator_worker && python run.py

# terminal 6
cd workers/api_server && python run.py
```

API Server will be available at:

- `http://localhost:8000`

---

## 3) Test credentials used in examples

All request examples below use:

- **mobile:** `09133040700`
- **password:** `AMIR@700`
- **base_domain:** `https://demo.hivagold.com`

---

## 4) API Server APIs (`http://localhost:8000`)

### Health

```bash
curl http://localhost:8000/health
```

### Auth

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com"}'
```

```bash
curl -X POST http://localhost:8000/logout \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","base_domain":"https://demo.hivagold.com"}'
```

### Signals

```bash
curl http://localhost:8000/signals/latest
```

### Room Status

```bash
curl -X POST http://localhost:8000/room/status \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

### Room Generic Action APIs (`/room/{action_name}`)

#### Portfolios

```bash
curl -X POST http://localhost:8000/room/portfolios \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com"}'
```

#### Create Portfolio

```bash
curl -X POST http://localhost:8000/room/portfolio-create \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","payload":{}}'
```

#### Orders

```bash
curl -X POST http://localhost:8000/room/orders \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

#### Create Order

```bash
curl -X POST http://localhost:8000/room/order-create \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","payload":{"market":"xag","side":"buy","units":1,"order_type":"market"}}'
```

#### Close Order

```bash
curl -X POST http://localhost:8000/room/order-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","payload":{"order_id":12345}}'
```

#### Transactions

```bash
curl -X POST http://localhost:8000/room/transactions \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

#### Close Transaction

```bash
curl -X POST http://localhost:8000/room/transaction-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","payload":{"transaction_id":12345}}'
```

#### Close Portfolio

```bash
curl -X POST http://localhost:8000/room/portfolio-close \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com","payload":{"portfolio_id":12345}}'
```

### Portfolio APIs (proxied by API Server)

#### Upsert strategy rule

```bash
curl -X POST http://localhost:8000/portfolio/rules \
  -H "Content-Type: application/json" \
  -d '{"strategy":"ema_wall_v1","symbol":"xag","enabled":true,"max_open_positions":1,"risk":0.01}'
```

#### Create manual portfolio order

```bash
curl -X POST http://localhost:8000/portfolio/orders \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","symbol":"xag","side":"buy","entry_price":32.1,"tp":33.1,"sl":31.6,"strategy":"manual"}'
```

#### Create bot portfolio order

```bash
curl -X POST http://localhost:8000/portfolio/orders/bot \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","symbol":"xag","side":"buy","entry_price":32.1,"strategy":"ema_wall_v1"}'
```

#### Price tick

```bash
curl -X POST http://localhost:8000/portfolio/price \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","symbol":"xag","price":32.4}'
```

#### User stats

```bash
curl http://localhost:8000/portfolio/users/09133040700/stats
```

#### DB records

```bash
curl http://localhost:8000/portfolio/db/records
```

#### Strategy PnL/positions

```bash
curl http://localhost:8000/portfolio/strategies/ema_wall_v1/pnl-positions
```

#### Admin DB snapshot

```bash
curl http://localhost:8000/admin/db/all -H "x-admin-key: change-me-admin"
```

---

## 5) Worker-level APIs (direct access)

### Bot Auth Worker (`http://localhost:8002`)

```bash
curl http://localhost:8002/health
```

```bash
curl -X POST http://localhost:8002/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","password":"AMIR@700","base_domain":"https://demo.hivagold.com"}'
```

```bash
curl -X POST http://localhost:8002/logout \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","base_domain":"https://demo.hivagold.com"}'
```

### Bot Captcha Worker (`http://localhost:8001`)

```bash
curl http://localhost:8001/health
```

```bash
curl -X POST http://localhost:8001/solve \
  -F "image=@captcha.jpg"
```

### Bot Room Worker (`http://localhost:8003`)

```bash
curl http://localhost:8003/health
```

```bash
curl -X POST http://localhost:8003/room/status \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

```bash
curl -X POST http://localhost:8003/room/orders \
  -H "Content-Type: application/json" \
  -d '{"mobile":"09133040700","base_domain":"https://demo.hivagold.com","market":"xag"}'
```

### Bot Trading Worker (`http://localhost:8004`)

```bash
curl http://localhost:8004/health
```

```bash
curl http://localhost:8004/signals/latest
```

```bash
curl -X POST http://localhost:8004/trading/process \
  -H "Content-Type: application/json" \
  -d '{"action":"status","payload":{}}'
```

WebSocket stream:

- `ws://localhost:8004/signals/ws`

### Bot Simulator Worker (`http://localhost:8007`)

All endpoints below require header `x-api-key`.

```bash
curl http://localhost:8007/health
```

```bash
curl -X POST http://localhost:8007/portfolio/orders \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"mobile":"09133040700","symbol":"xag","side":"buy","entry_price":32.1,"strategy":"ema_wall_v1"}'
```

```bash
curl -X PATCH http://localhost:8007/portfolio/users/09133040700/positions/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"tp":33.2,"sl":31.5}'
```

```bash
curl -X POST http://localhost:8007/portfolio/users/09133040700/positions/1/close \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"close_price":32.8,"reason":"manual-close"}'
```

```bash
curl -X POST http://localhost:8007/portfolio/price \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me" \
  -d '{"mobile":"09133040700","symbol":"xag","price":32.5}'
```

```bash
curl -H "x-api-key: change-me" http://localhost:8007/portfolio/users/09133040700/stats
curl -H "x-api-key: change-me" http://localhost:8007/portfolio/users/09133040700/history
curl -H "x-api-key: change-me" http://localhost:8007/portfolio/db/records
curl -H "x-api-key: change-me" http://localhost:8007/portfolio/strategies/ema_wall_v1/pnl-positions
curl -H "x-api-key: change-me" http://localhost:8007/portfolio/admin/db
```
