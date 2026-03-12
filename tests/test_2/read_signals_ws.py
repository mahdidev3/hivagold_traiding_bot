#!/usr/bin/env python3

import asyncio
import json

import websockets

SIGNAL_WS_URL = "ws://127.0.0.1:8006/signals/ws"


async def main() -> None:
    async with websockets.connect(SIGNAL_WS_URL, ping_interval=None) as ws:
        print(f"Connected to {SIGNAL_WS_URL}")
        while True:
            msg = await ws.recv()
            try:
                print(json.dumps(json.loads(msg), ensure_ascii=False, indent=2))
            except Exception:
                print(msg)


if __name__ == "__main__":
    asyncio.run(main())
