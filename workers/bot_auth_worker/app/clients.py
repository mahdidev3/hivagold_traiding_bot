import logging
import time
from typing import Any, Optional, Tuple
import json
import requests
from pathlib import Path
from urllib.parse import urlparse
from config import Config


def normalize_mobile(mobile: str) -> str:
    value = "".join(ch for ch in (mobile or "").strip() if ch.isdigit())
    if not value:
        return value
    if value.startswith("0098") and len(value) >= 12:
        value = "0" + value[4:]
    elif value.startswith("98") and len(value) >= 12:
        value = "0" + value[2:]
    elif len(value) == 10 and not value.startswith("0"):
        value = f"0{value}"
    return value


def normalize_domain_key(domain: str) -> str:
    value = (domain or "").strip()
    if not value:
        return value
    parsed = urlparse(value if "://" in value else f"//{value}")
    hostname = (parsed.hostname or "").strip().lower()
    if not hostname:
        host_port = parsed.netloc or parsed.path
        return host_port.split("/", 1)[0].strip().lower()
    if parsed.port:
        return f"{hostname}:{parsed.port}"
    return hostname


def domain_key_candidates(domain: str) -> list[str]:
    raw = (domain or "").strip().rstrip("/")
    normalized = normalize_domain_key(raw)
    candidates: list[str] = []
    if normalized:
        candidates.append(normalized)
    if raw:
        candidates.append(raw)
    parsed = urlparse(raw if "://" in raw else f"//{raw}")
    if parsed.netloc:
        candidates.append(parsed.netloc.lower())
    if parsed.hostname:
        candidates.append(parsed.hostname.lower())
    unique: list[str] = []
    for item in candidates:
        if item and item not in unique:
            unique.append(item)
    return unique


class MainApiClient:
    """
    Client for your upstream API.

    You should replace endpoint URLs with your real URLs.
    """

    def __init__(self, config: Config, logger: logging.Logger):
        self.config = config
        self.logger = logger
        self.connect_timeout = max(1, int(config.MAIN_API_CONNECT_TIMEOUT_SECONDS))
        self.read_timeout = max(1, int(config.MAIN_API_READ_TIMEOUT_SECONDS))
        self.max_retries = max(1, int(config.MAIN_API_MAX_RETRIES))
        self.retry_delay_seconds = max(0.0, float(config.MAIN_API_RETRY_DELAY_SECONDS))

    def _request_with_retries(
        self,
        method: str,
        url: str,
        cookies: Optional[dict] = None,
        headers: Optional[dict] = None,
        **kwargs: Any,
    ) -> requests.Response:
        last_exc: Optional[Exception] = None
        timeout = kwargs.pop("timeout", (self.connect_timeout, self.read_timeout))

        for attempt in range(1, self.max_retries + 1):
            try:
                return requests.request(
                    method=method,
                    url=url,
                    timeout=timeout,
                    cookies=cookies,
                    headers=headers,
                    **kwargs,
                )
            except (requests.Timeout, requests.ConnectionError) as exc:
                last_exc = exc
                self.logger.warning(
                    "Upstream request failed attempt=%s/%s method=%s url=%s error=%s",
                    attempt,
                    self.max_retries,
                    method,
                    url,
                    exc,
                )
                if attempt == self.max_retries:
                    break
                if self.retry_delay_seconds > 0:
                    time.sleep(self.retry_delay_seconds)
            except requests.RequestException:
                raise

        raise RuntimeError(
            f"Upstream request failed after {self.max_retries} attempts: "
            f"{method} {url} ({last_exc})"
        ) from last_exc

    def _update_cookies_from_response(
        self,
        response: requests.Response,
        cookies: Optional[dict],
        headers: Optional[dict],
    ):
        """
        Update cookies dict with cookies from HTTP response.
        """
        if response.cookies is None or cookies is None:
            return
        for cookie in response.cookies:
            cookies[cookie.name] = cookie.value

        # if csrf token is in cookies, also add it to headers for next requests
        if "csrftoken" in cookies:
            if headers is not None:
                headers["X-Csrftoken"] = cookies["csrftoken"]

    def get_captcha(
        self,
        get_captcha_info_url: str,
        cookies: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> Tuple[str, str]:
        """
        Fetch captcha from upstream service.

        Expected upstream behavior:
        - HTTP response body is the captcha image bytes
        - header 'X-Captcha-Key' contains captcha key

        If your upstream is different, adjust this method only.
        """
        url = get_captcha_info_url
        r = self._request_with_retries(
            method="GET",
            url=url,
            cookies=cookies,
            headers=headers,
        )
        r.raise_for_status()

        data = r.json()
        key = data.get("captcha_key", None)
        image_path = data.get("image_url", None)
        if not key:
            raise ValueError("Captcha key not found in response")
        if not image_path:
            raise ValueError("Captcha image PATH not found in response")

        self._update_cookies_from_response(r, cookies, headers)

        return key, image_path

    def verify_captcha(
        self,
        key: str,
        code: str,
        verify_captcha_url: str,
        cookies: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> requests.Response:
        """
        Verify solved captcha with upstream API.
        """
        url = verify_captcha_url
        payload = {
            "captcha_key": key,
            "captcha_value": code,
        }
        r = self._request_with_retries(
            method="POST",
            url=url,
            json=payload,
            cookies=cookies,
            headers=headers,
        )
        self._update_cookies_from_response(r, cookies, headers)
        return r

    def login(
        self,
        login_url: str,
        mobile: str,
        password: str,
        cookies: Optional[dict] = None,
        headers: Optional[dict] = None,
    ) -> requests.Response:
        """
        Perform login request with upstream API.
        """
        payload = {
            "username": mobile,
            "password": password,
        }
        r = self._request_with_retries(
            method="POST",
            url=login_url,
            json=payload,
            cookies=cookies,
            headers=headers,
        )
        self._update_cookies_from_response(r, cookies, headers)
        return r

    def check_cookies_valid(
        self, cookies: dict, cookies_validation_url: str, headers: Optional[dict] = None
    ) -> bool:
        """
        Check if existing cookies are still valid by making a request to a protected endpoint.
        This is a placeholder implementation and should be adjusted to your actual validation logic.
        """
        if not cookies:
            return False

        r = self._request_with_retries(
            method="GET",
            url=cookies_validation_url,
            cookies=cookies,
            headers=headers,
        )

        if r.status_code == 200:
            return True

        if r.status_code == 401 or r.status_code == 403:
            return False

        if (
            r.status_code == 500
            or r.status_code == 502
            or r.status_code == 503
            or r.status_code == 400
        ):
            if self.config.ENVIRONMENT == "development":
                self.logger.warning(
                    "Received status %s from cookies validation endpoint %s, treating as invalid cookies",
                    r.status_code,
                    cookies_validation_url,
                )
            return False

        return False


class CaptchaWorkerClient:
    """
    REST client for captcha worker.
    """

    def __init__(
        self,
        captcha_solve_url: str,
        logger: logging.Logger,
        timeout_seconds: int = 60,
        max_retries: int = 3,
    ):
        self.captcha_solve_url = captcha_solve_url
        self.logger = logger
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries

    def solve(self, captcha_image_url: str) -> str:
        """
        Send captcha image to captcha worker and return solved code.
        """
        last_exc: Optional[Exception] = None
        for attempt in range(1, self.max_retries + 1):
            try:
                r = requests.post(
                    self.captcha_solve_url,
                    json={"image_url": captcha_image_url},
                    timeout=self.timeout_seconds,
                )
                r.raise_for_status()
                data = r.json()
                return data["code"]
            except requests.RequestException as exc:
                last_exc = exc
                self.logger.warning(
                    "Captcha worker request failed attempt=%s/%s url=%s error=%s",
                    attempt,
                    self.max_retries,
                    self.captcha_solve_url,
                    exc,
                )
                if attempt == self.max_retries:
                    break
                time.sleep(1.5)

        raise RuntimeError(
            f"Failed to connect to captcha worker at {self.captcha_solve_url} "
            f"after {self.max_retries} attempts: {last_exc}"
        ) from last_exc


class UserSessionStore:
    """File-based session storage under projectroot/Users/<mobile>/User_info.json."""

    def __init__(self, users_root: str, logger: logging.Logger):
        self.users_root = Path(users_root)
        self.logger = logger

    def _user_file(self, mobile: str) -> Path:
        normalized_mobile = normalize_mobile(mobile) or (mobile or "").strip()
        return self.users_root / normalized_mobile / "User_info.json"

    def _read_user_info(self, mobile: str) -> dict[str, Any]:
        file_path = self._user_file(mobile)
        if not file_path.exists():
            return {"sessions": {}}
        try:
            with file_path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
        except (json.JSONDecodeError, OSError):
            self.logger.warning("Corrupted user info file: %s", file_path)
            return {"sessions": {}}
        if not isinstance(data, dict):
            return {"sessions": {}}
        sessions = data.get("sessions")
        if not isinstance(sessions, dict):
            data["sessions"] = {}
        return data

    def _write_user_info(self, mobile: str, data: dict[str, Any]) -> None:
        file_path = self._user_file(mobile)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with file_path.open("w", encoding="utf-8") as handle:
            json.dump(data, handle, ensure_ascii=False, indent=2)

    def save_login_data(
        self, mobile: str, login_data: Any, domain: str, ttl: int
    ) -> bool:
        normalized_domain = normalize_domain_key(domain)
        user_info = self._read_user_info(mobile)
        user_info.setdefault("sessions", {})
        user_info["sessions"][normalized_domain] = {
            "cookies": (login_data or {}).get("cookies", {}),
            "headers": (login_data or {}).get("headers", {}),
        }
        self._write_user_info(mobile, user_info)
        self.logger.debug(
            "Saved login data in file for domain=%s mobile=%s ttl=%s",
            normalized_domain,
            normalize_mobile(mobile),
            ttl,
        )
        return True

    def get_login_data(self, mobile: str, domain: str) -> Optional[dict]:
        user_info = self._read_user_info(mobile)
        sessions = user_info.get("sessions") or {}
        for domain_candidate in domain_key_candidates(domain):
            data = sessions.get(domain_candidate)
            if isinstance(data, dict):
                self.logger.debug(
                    "Loaded user session from file for domain=%s mobile=%s",
                    domain_candidate,
                    normalize_mobile(mobile),
                )
                return data
        self.logger.debug(
            "No file-based login data found for domain=%s mobile=%s", domain, mobile
        )
        return None

    def delete_login_data(self, mobile: str, domain: str) -> int:
        user_info = self._read_user_info(mobile)
        sessions = user_info.get("sessions") or {}
        deleted_count = 0
        for domain_candidate in domain_key_candidates(domain):
            if domain_candidate in sessions:
                del sessions[domain_candidate]
                deleted_count += 1
        if deleted_count:
            user_info["sessions"] = sessions
            self._write_user_info(mobile, user_info)
        return deleted_count


def build_clients(
    config: Config,
    logger: logging.Logger,
) -> Tuple[MainApiClient, CaptchaWorkerClient, UserSessionStore]:
    """
    Build service clients from environment variables.
    """
    captcha_solve_url = config.CAPTCHA_SOLVE_URL
    captcha_timeout = config.CAPTCHA_WORKER_TIMEOUT_SECONDS
    captcha_retries = config.CAPTCHA_WORKER_MAX_RETRIES

    return (
        MainApiClient(config, logger),
        CaptchaWorkerClient(
            captcha_solve_url, logger, captcha_timeout, captcha_retries
        ),
        UserSessionStore(config.USERS_STORAGE_DIR, logger),
    )
