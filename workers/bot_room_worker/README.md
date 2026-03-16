# Bot Room Worker

## What this worker does

`bot_room_worker` is the trading-room gateway. It runs room-level operations using stored auth session cookies:

- Room status checks
- Portfolio operations
- Orders operations
- Transactions operations

## How this worker is used

- Called by trading logic (`bot_trading_worker`) when `run_mode=real`.
- Can be used directly for manual room operations.

Default local base URL:

- `http://localhost:8003`

## APIs

### `GET /health`
Health probe.

### `POST /room/status`
Check market/room status.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "market": "xag"
}
```

### `POST /room/portfolios`
Get user portfolios.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag"
}
```

### `POST /room/portfolio/create`
Create active portfolio.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "portfolio_type": "real",
  "initial_balance": 1000000
}
```

### `POST /room/orders`
Get orders list.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag"
}
```

### `POST /room/order/create`
Create order.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "order_type": "market",
  "action": "buy",
  "units": 1,
  "price": 31.2,
  "stop_loss": 30.7,
  "take_profit": 32.0
}
```

### `POST /room/order/close`
Close order by id.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "order_id": "12345"
}
```

### `POST /room/transactions`
Get transactions list.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag"
}
```

### `POST /room/transaction/close`
Close transaction by id.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "transaction_id": "tx-12345"
}
```

### `POST /room/portfolio/close`
Close portfolio by id.

```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com",
  "room_prefix": "xag",
  "portfolio_id": "pf-12345"
}
```

## Full API examples (curl)

```bash
# health
curl http://localhost:8003/health

# room status
curl -X POST http://localhost:8003/room/status \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","base_domain":"https://hivagold.com","room_prefix":"xag","market":"xag"}'

# create order
curl -X POST http://localhost:8003/room/order/create \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","base_domain":"https://hivagold.com","room_prefix":"xag","order_type":"market","action":"buy","units":1,"price":31.2,"stop_loss":30.7,"take_profit":32.0}'

# close order
curl -X POST http://localhost:8003/room/order/close \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","base_domain":"https://hivagold.com","room_prefix":"xag","order_id":"12345"}'
```
