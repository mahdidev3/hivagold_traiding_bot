import json
import threading
import time
from pathlib import Path
from typing import Any, Optional


class JsonCacheStore:
    def __init__(self, path: str):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()

    def _read_all(self) -> dict[str, Any]:
        if not self.path.exists():
            return {}
        try:
            return json.loads(self.path.read_text(encoding='utf-8'))
        except Exception:
            return {}

    def _write_all(self, data: dict[str, Any]) -> None:
        self.path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

    def get(self, key: str) -> Optional[dict[str, Any]]:
        with self._lock:
            data = self._read_all()
            item = data.get(key)
            if not isinstance(item, dict):
                return None
            expires_at = item.get('expires_at')
            if expires_at and float(expires_at) < time.time():
                data.pop(key, None)
                self._write_all(data)
                return None
            return item.get('value')

    def set(self, key: str, value: dict[str, Any], ttl_seconds: int | None = None) -> bool:
        with self._lock:
            data = self._read_all()
            expires_at = None
            if ttl_seconds and ttl_seconds > 0:
                expires_at = time.time() + ttl_seconds
            data[key] = {'value': value, 'expires_at': expires_at}
            self._write_all(data)
        return True

    def delete_many(self, keys: list[str]) -> int:
        removed = 0
        with self._lock:
            data = self._read_all()
            for key in keys:
                if key in data:
                    removed += 1
                    data.pop(key, None)
            self._write_all(data)
        return removed
