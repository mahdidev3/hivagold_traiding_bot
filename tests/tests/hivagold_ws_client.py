import asyncio
import json
import ssl
from pathlib import Path

import requests
import websockets


BASE_DOMAIN = "demo.hivagold.com"
BASE_URL = f"https://{BASE_DOMAIN}"
BASE_ORIGIN = BASE_URL
BASE_REFERER = f"{BASE_URL}/ounce/"

LIVE_BARS_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/live-bars/"
PRICE_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/price/"
WALL_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/wall/"

LIVE_SUB_MESSAGE = {
    "action": "SubAdd",
    "subs": ["0~hivagold~ounce~gold"],
}

PRICE_PING_MESSAGE = {
    "type": "ping",
}


def load_cookies(path="cookies.json"):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def cookie_header_from_session(session: requests.Session) -> str:
    return "; ".join(f"{c.name}={c.value}" for c in session.cookies)


def pretty(obj):
    try:
        return json.dumps(obj, ensure_ascii=False, indent=2)
    except Exception:
        return str(obj)


def build_http_session(cookies: dict) -> requests.Session:
    s = requests.Session()

    s.headers.update(
        {
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            ),
            "Accept": (
                "text/html,application/xhtml+xml,application/xml;q=0.9,"
                "image/avif,image/webp,image/apng,*/*;q=0.8"
            ),
            "Accept-Language": "fa-IR,fa;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Referer": BASE_REFERER,
        }
    )

    for k, v in cookies.items():
        s.cookies.set(k, v, domain=BASE_DOMAIN, path="/")

    return s


async def recv_loop(name, ws):
    async for message in ws:
        print(f"\n[RECV:{name}] raw:")
        print(message)
        try:
            parsed = json.loads(message)
            print(f"[RECV:{name}] json:")
            print(pretty(parsed))
        except Exception:
            pass


async def price_ping_loop(ws, stop_event: asyncio.Event):
    while not stop_event.is_set():
        await asyncio.sleep(30)
        if stop_event.is_set():
            break
        msg = json.dumps(PRICE_PING_MESSAGE, ensure_ascii=False)
        await ws.send(msg)
        print(f"[SEND:price] {msg}")


async def ws_connect(name, url, headers, stop_event: asyncio.Event, on_open=None):
    ssl_context = ssl.create_default_context()

    while not stop_event.is_set():
        ping_task = None
        try:
            print(f"[CONNECT:{name}] {url}")
            async with websockets.connect(
                url,
                additional_headers=headers,
                origin=BASE_ORIGIN,
                ssl=ssl_context,
                ping_interval=None,
                ping_timeout=None,
                close_timeout=10,
                max_size=None,
            ) as ws:
                print(f"[OPEN:{name}] connected")

                if on_open:
                    maybe_task = await on_open(ws, stop_event)
                    if maybe_task is not None:
                        ping_task = maybe_task

                await recv_loop(name, ws)

        except Exception as e:
            print(f"[ERROR:{name}] {e}")

        finally:
            if ping_task:
                ping_task.cancel()
                try:
                    await ping_task
                except Exception:
                    pass

        if not stop_event.is_set():
            print(f"[RETRY:{name}] retrying in 3s...")
            await asyncio.sleep(3)


async def on_open_live(ws, stop_event):
    msg = json.dumps(LIVE_SUB_MESSAGE, ensure_ascii=False)
    await ws.send(msg)
    print(f"[SEND:live-bars] {msg}")


async def on_open_price(ws, stop_event):
    return asyncio.create_task(price_ping_loop(ws, stop_event))


async def main():
    cookies = load_cookies("cookies.json")
    session = build_http_session(cookies)

    print("[STEP] opening site first to establish session context...")

    r = session.get(BASE_REFERER, timeout=20, allow_redirects=True)

    print("[HTTP] status:", r.status_code)
    print("[HTTP] final url:", r.url)
    print("[HTTP] cookies after GET:")
    print(pretty(session.cookies.get_dict()))

    cookie_header = cookie_header_from_session(session)

    ws_headers = {
        "User-Agent": session.headers["User-Agent"],
        "Cookie": cookie_header,
        "Referer": BASE_REFERER,
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Accept-Language": session.headers["Accept-Language"],
    }

    if "csrftoken" in session.cookies.get_dict():
        ws_headers["X-CSRFToken"] = session.cookies.get_dict()["csrftoken"]

    print("[WS HEADERS]")
    print(pretty(ws_headers))

    stop_event = asyncio.Event()

    tasks = [
        asyncio.create_task(
            ws_connect("live-bars", LIVE_BARS_URL, ws_headers, stop_event, on_open_live)
        ),
        asyncio.create_task(
            ws_connect("price", PRICE_URL, ws_headers, stop_event, on_open_price)
        ),
        asyncio.create_task(ws_connect("wall", WALL_URL, ws_headers, stop_event)),
    ]

    try:
        await asyncio.gather(*tasks)
    except KeyboardInterrupt:
        stop_event.set()


# https://demo.hivagold.com/ounce/api/ounce-bars/?symbol=ounce&from=1773055080&to=1773056940&resolution=1

if __name__ == "__main__":
    asyncio.run(main())
