import logging
import time
from typing import Any, Optional, Tuple
import redis
import json
import requests
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


class RedisClient:
    """
    Redis wrapper that receives a Redis connection pool.
    """

    def __init__(self, redis_pool: redis.ConnectionPool, logger: logging.Logger):
        self.redis_pool = redis_pool
        self.logger = logger

    def _redis_connection(self) -> redis.Redis:
        return redis.Redis(connection_pool=self.redis_pool, decode_responses=True)

    def save_login_data(
        self, mobile: str, login_data: Any, domain: str, ttl: int
    ) -> bool:
        """
        Save login session data (cookies, headers) in Redis as JSON.
        ttl default = 14 days
        """
        conn = self._redis_connection()
        serialized = json.dumps(login_data)
        normalized_mobile = normalize_mobile(mobile)
        normalized_domain = normalize_domain_key(domain)
        self.logger.debug(
            "Saving login data in redis key=%s:%s ttl=%s",
            normalized_domain,
            normalized_mobile,
            ttl,
        )
        return bool(
            conn.setex(f"{normalized_domain}:{normalized_mobile}", ttl, serialized)
        )

    def get_login_data(self, mobile: str, domain: str) -> Optional[dict]:
        conn = self._redis_connection()
        normalized_mobile = normalize_mobile(mobile)
        mobile_candidates = [normalized_mobile, (mobile or "").strip()]
        for domain_candidate in domain_key_candidates(domain):
            for mobile_candidate in mobile_candidates:
                if not mobile_candidate:
                    continue
                redis_key = f"{domain_candidate}:{mobile_candidate}"
                self.logger.info(redis_key)
                data = conn.get(redis_key)
                if not data:
                    continue
                try:
                    parsed = json.loads(data)
                    self.logger.debug("Loaded redis login data for key=%s", redis_key)
                    return parsed
                except json.JSONDecodeError as exc:
                    raise exc
        self.logger.debug(
            "No redis login data found for domain=%s mobile=%s", domain, mobile
        )
        return None

    def delete_login_data(self, mobile: str, domain: str) -> int:
        conn = self._redis_connection()
        normalized_mobile = normalize_mobile(mobile)
        mobile_candidates = [normalized_mobile, (mobile or "").strip()]
        redis_keys: list[str] = []
        for domain_candidate in domain_key_candidates(domain):
            for mobile_candidate in mobile_candidates:
                if mobile_candidate:
                    redis_keys.append(f"{domain_candidate}:{mobile_candidate}")
        unique_keys: list[str] = []
        for key in redis_keys:
            if key not in unique_keys:
                unique_keys.append(key)
        if not unique_keys:
            return 0
        return int(conn.delete(*unique_keys))


def build_clients(
    config: Config,
    logger: logging.Logger,
) -> Tuple[MainApiClient, CaptchaWorkerClient, RedisClient]:
    """
    Build service clients from environment variables.
    """
    captcha_solve_url = config.CAPTCHA_SOLVE_URL
    captcha_timeout = config.CAPTCHA_WORKER_TIMEOUT_SECONDS
    captcha_retries = config.CAPTCHA_WORKER_MAX_RETRIES

    redis_host = config.REDIS_HOST
    redis_port = config.REDIS_PORT
    redis_db = config.REDIS_DB
    redis_password = config.REDIS_PASSWORD.strip() or None

    redis_pool = redis.ConnectionPool(
        host=redis_host,
        port=redis_port,
        db=redis_db,
        password=redis_password,
        decode_responses=True,
    )
    return (
        MainApiClient(config, logger),
        CaptchaWorkerClient(
            captcha_solve_url, logger, captcha_timeout, captcha_retries
        ),
        RedisClient(redis_pool, logger),
    )
