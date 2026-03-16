# Bot Captcha Worker

## What this worker does

`bot_captcha_worker` downloads a captcha image from a URL and returns the recognized captcha code.

## How this worker is used

- Primarily called by `bot_auth_worker` as part of the login flow.
- Can be called directly for captcha testing.

Default local base URL:

- `http://localhost:8002`

## APIs

### `GET /health`
Health probe.

### `POST /solve`
Solve captcha from an image URL.

Request body:
```json
{
  "image_url": "https://hivagold.com/api/user/captcha/some-image"
}
```

Response:
```json
{
  "code": "123456"
}
```

## Full API examples (curl)

```bash
# health
curl http://localhost:8002/health

# solve
curl -X POST http://localhost:8002/solve \
  -H 'Content-Type: application/json' \
  -d '{"image_url":"https://example.com/captcha.png"}'
```
