# Bot Auth Worker

## What this worker does

`bot_auth_worker` performs login/logout against the target trading domain and maintains user session cookies in the shared session store.

It also integrates with `bot_captcha_worker` during login.

## How this worker is used

- Called by `api_server` (`/login`, `/logout`).
- Can also be called directly for debugging auth flows.

Default local base URL (depends on your env):

- `http://localhost:8001`

## APIs

### `GET /health`
Health probe.

### `POST /login`
Login a user and refresh stored cookies.

Request body:
```json
{
  "mobile": "09123456789",
  "password": "your-password",
  "max_retries": 3,
  "base_domain": "https://hivagold.com"
}
```

Response:
```json
{ "success": true }
```

### `POST /logout`
Remove/invalidate worker-side session for a user.

Request body:
```json
{
  "mobile": "09123456789",
  "base_domain": "https://hivagold.com"
}
```

Response:
```json
{ "success": true }
```

## Full API examples (curl)

```bash
# health
curl http://localhost:8001/health

# login
curl -X POST http://localhost:8001/login \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","password":"pass","max_retries":3,"base_domain":"https://hivagold.com"}'

# logout
curl -X POST http://localhost:8001/logout \
  -H 'Content-Type: application/json' \
  -d '{"mobile":"09123456789","base_domain":"https://hivagold.com"}'
```
