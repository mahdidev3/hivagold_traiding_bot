# Hivagold Trading Bot

This project is now intentionally minimal:

- **Auth endpoints**: login / logout
- **Bot control endpoints**: create / remove / start / stop bot

All room-related gateway endpoints were removed from `api_server`.

## API Server Endpoints

Base URL: `http://localhost:8000`

- `GET /health`
- `POST /login`
- `POST /logout`
- `POST /bots/create`
- `POST /bots/remove`
- `POST /bots/start`
- `POST /bots/stop`

### Examples

```bash
curl -X POST http://localhost:8000/login \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass"}'

curl -X POST http://localhost:8000/bots/create \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass","domain":"https://hivagold.com"}'

curl -X POST http://localhost:8000/bots/start \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","domain":"https://hivagold.com"}'

curl -X POST http://localhost:8000/bots/stop \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-123"}'

curl -X POST http://localhost:8000/bots/remove \
  -H 'Content-Type: application/json' \
  -d '{"bot_id":"bot-123"}'
```
