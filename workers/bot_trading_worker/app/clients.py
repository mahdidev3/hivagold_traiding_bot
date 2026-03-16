import json
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse


def _normalize_mobile(mobile: str) -> str:
    value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
    if value.startswith("0098") and len(value) >= 12:
        value = "0" + value[4:]
    elif value.startswith("98") and len(value) >= 12:
        value = "0" + value[2:]
    elif len(value) == 10 and not value.startswith("0"):
        value = f"0{value}"
    return value


def _normalize_domain(base_domain: str) -> str:
    value = (base_domain or "").strip()
    if not value:
        return ""
    parsed = urlparse(value if "://" in value else f"https://{value}")
    host = parsed.netloc or parsed.path
    return host.lower()


class SessionStore:
    """Loads auth worker sessions from Users/<mobile>/User_info.json with an in-memory cache."""

    def __init__(self, users_storage_dir: str):
        self.users_storage_dir = Path(users_storage_dir)
        self._cache: dict[tuple[str, str], Optional[dict[str, Any]]] = {}

    def _user_file(self, mobile: str) -> Path:
        normalized = _normalize_mobile(mobile)
        return self.users_storage_dir / normalized / "User_info.json"

    def get_session_data(self, mobile: str, base_domain: str) -> Optional[dict[str, Any]]:
        normalized_mobile = _normalize_mobile(mobile)
        normalized_domain = _normalize_domain(base_domain)
        key = (normalized_mobile, normalized_domain)
        if key in self._cache:
            return self._cache[key]

        path = self._user_file(normalized_mobile)
        if not path.exists():
            self._cache[key] = None
            return None

        with path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)

        sessions = payload.get("sessions") if isinstance(payload, dict) else None
        session = None
        if isinstance(sessions, dict):
            session = sessions.get(normalized_domain)
            if session is None and ":" in normalized_domain:
                session = sessions.get(normalized_domain.split(":", 1)[0])
        self._cache[key] = session
        return session
