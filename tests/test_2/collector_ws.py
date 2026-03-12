#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
collector_ws.py
- Connects to HivaGold websocket endpoints
- Stores raw messages as JSONL
- Maintains latest state snapshot for price / wall / live-bars
"""

import asyncio
import json
import ssl
import time
from pathlib import Path
from typing import Any

import requests
import websockets

BASE_DOMAIN = "demo.hivagold.com"
BASE_URL = f"https://{BASE_DOMAIN}"
BASE_ORIGIN = BASE_URL
BASE_REFERER = f"{BASE_URL}/ounce/"

LIVE_BARS_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/live-bars/"
PRICE_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/price/"
WALL_URL = f"wss://{BASE_DOMAIN}/ounce/ws/ounce/wall/"

OUT_DIR = Path("data_ws")
OUT_DIR.mkdir(exist_ok=True)

LIVE_SUB_MESSAGE = {"action": "SubAdd", "subs": ["0~hivagold~ounce~gold"]}
PRICE_PING_MESSAGE = {"type": "ping"}


def load_cookies(path: str = "cookies.json") -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def pretty(obj: Any) -> str:
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


def cookie_header_from_session(session: requests.Session) -> str:
    return "; ".join(f"{c.name}={c.value}" for c in session.cookies)


def write_jsonl(path: Path, obj: dict) -> None:
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def write_state(path: Path, obj: dict) -> None:
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")


async def recv_loop(name: str, ws) -> None:
    raw_file = OUT_DIR / f"{name}.jsonl"
    latest_file = OUT_DIR / f"{name}_latest.json"
    async for message in ws:
        now = time.time()
        record = {
            "stream": name,
            "recv_ts": now,
            "raw": message,
        }
        try:
            record["json"] = json.loads(message)
        except Exception:
            record["json"] = None
        write_jsonl(raw_file, record)
        if record["json"] is not None:
            write_state(latest_file, record)
        print(f"[RECV:{name}] {message}")


async def price_ping_loop(ws, stop_event: asyncio.Event) -> None:
    while not stop_event.is_set():
        await asyncio.sleep(30)
        if stop_event.is_set():
            break
        msg = json.dumps(PRICE_PING_MESSAGE, ensure_ascii=False)
        await ws.send(msg)
        print(f"[SEND:price] {msg}")


async def ws_connect(name: str, url: str, headers: dict, stop_event: asyncio.Event, on_open=None):
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
        except Exception as exc:
            print(f"[ERROR:{name}] {exc}")
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

    r = session.get(BASE_REFERER, timeout=20, allow_redirects=True)
    print("[HTTP] status:", r.status_code)
    print("[HTTP] final url:", r.url)
    print("[HTTP] cookies:", session.cookies.get_dict())

    ws_headers = {
        "User-Agent": session.headers["User-Agent"],
        "Cookie": cookie_header_from_session(session),
        "Referer": BASE_REFERER,
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Accept-Language": session.headers["Accept-Language"],
    }
    if "csrftoken" in session.cookies.get_dict():
        ws_headers["X-CSRFToken"] = session.cookies.get_dict()["csrftoken"]

    stop_event = asyncio.Event()
    tasks = [
        asyncio.create_task(ws_connect("live-bars", LIVE_BARS_URL, ws_headers, stop_event, on_open_live)),
        asyncio.create_task(ws_connect("price", PRICE_URL, ws_headers, stop_event, on_open_price)),
        asyncio.create_task(ws_connect("wall", WALL_URL, ws_headers, stop_event)),
    ]

    try:
        await asyncio.gather(*tasks)
    except KeyboardInterrupt:
        stop_event.set()


if __name__ == "__main__":
    asyncio.run(main())
