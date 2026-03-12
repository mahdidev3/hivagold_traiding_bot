import os
import socket
import sys
import time
from typing import List, Union


RedisArg = Union[str, bytes, int]


def _encode_command(*parts: RedisArg) -> bytes:
    encoded_parts: List[bytes] = []
    for part in parts:
        if isinstance(part, bytes):
            encoded_parts.append(part)
        else:
            encoded_parts.append(str(part).encode("utf-8"))

    payload = f"*{len(encoded_parts)}\r\n".encode("utf-8")
    for part in encoded_parts:
        payload += f"${len(part)}\r\n".encode("utf-8") + part + b"\r\n"
    return payload


def _readline(sock: socket.socket) -> bytes:
    data = b""
    while not data.endswith(b"\r\n"):
        chunk = sock.recv(1)
        if not chunk:
            raise ConnectionError("Connection closed by Redis server")
        data += chunk
    return data[:-2]


def _read_response(sock: socket.socket):
    prefix = sock.recv(1)
    if not prefix:
        raise ConnectionError("No response from Redis server")

    if prefix == b"+":
        return _readline(sock).decode("utf-8")
    if prefix == b"-":
        msg = _readline(sock).decode("utf-8")
        raise RuntimeError(f"Redis error: {msg}")
    if prefix == b":":
        return int(_readline(sock))
    if prefix == b"$":
        length = int(_readline(sock))
        if length == -1:
            return None
        data = b""
        while len(data) < length:
            chunk = sock.recv(length - len(data))
            if not chunk:
                raise ConnectionError("Connection closed while reading bulk string")
            data += chunk
        if sock.recv(2) != b"\r\n":
            raise RuntimeError("Invalid Redis bulk string terminator")
        return data.decode("utf-8")

    raise RuntimeError(f"Unsupported Redis response prefix: {prefix!r}")


def _run_check(host: str, port: int, password: str, timeout: float) -> None:
    with socket.create_connection((host, port), timeout=timeout) as sock:
        auth_mode = "none"
        if password:
            try:
                sock.sendall(_encode_command("AUTH", password))
                auth = _read_response(sock)
                if auth != "OK":
                    raise RuntimeError(f"AUTH failed: {auth}")
                auth_mode = "password"
            except RuntimeError as exc:
                msg = str(exc)
                # Redis returns this when no password is configured for default user.
                if "without any password configured" not in msg:
                    raise
                auth_mode = "not-required"

        sock.sendall(_encode_command("PING"))
        pong = _read_response(sock)
        if pong != "PONG":
            raise RuntimeError(f"PING failed, got: {pong}")

        key = f"redis_worker_external_check:{int(time.time())}"
        value = "ok-from-outside"

        sock.sendall(_encode_command("SET", key, value, "EX", 30))
        set_result = _read_response(sock)
        if set_result != "OK":
            raise RuntimeError(f"SET failed, got: {set_result}")

        sock.sendall(_encode_command("GET", key))
        get_result = _read_response(sock)
        if get_result != value:
            raise RuntimeError(f"GET mismatch: expected {value!r}, got {get_result!r}")

        sock.sendall(_encode_command("DEL", key))
        _ = _read_response(sock)

        print(f"[OK] Redis reachable from outside at {host}:{port}")
        print(f"[OK] Auth mode: {auth_mode}")
        print("[OK] AUTH, PING, SET, GET, DEL all passed")


def main() -> int:
    host = os.getenv("REDIS_HOST", "127.0.0.1")
    port = int(os.getenv("REDIS_PORT", "6379"))
    password = os.getenv("REDIS_PASSWORD", "")
    timeout = float(os.getenv("REDIS_TIMEOUT", "5"))

    try:
        _run_check(host=host, port=port, password=password, timeout=timeout)
        return 0
    except Exception as exc:
        print(f"[ERROR] Redis outside-check failed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
