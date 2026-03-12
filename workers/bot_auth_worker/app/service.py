import logging
from typing import Dict, Optional
from urllib.parse import urljoin, urlparse

from config import Config

from .clients import (
    CaptchaWorkerClient,
    MainApiClient,
    RedisClient,
    normalize_domain_key,
    normalize_mobile,
)


class LoginWorkerService:
    """
    Service that performs login using captcha worker.
    """

    def __init__(
        self,
        api_client: MainApiClient,
        captcha_worker_client: CaptchaWorkerClient,
        redis_client: RedisClient,
        config: Config,
        logger: logging.Logger,
    ):
        self.api = api_client
        self.captcha_worker = captcha_worker_client
        self.redis_client = redis_client
        self.config = config
        self.logger = logger

    def _validate_login_data(
        self, login_data: Optional[dict], cookies_validation_url: str
    ) -> bool:
        if not isinstance(login_data, dict):
            return False

        cookies = login_data.get("cookies") or {}
        if not isinstance(cookies, dict):
            return False
        if not ("sessionid" in cookies and "csrftoken" in cookies):
            return False

        headers = login_data.get("headers") or {}
        if not isinstance(headers, dict):
            return False
        csrf_header = headers.get("X-Csrftoken")
        if not csrf_header:
            return False

        headers = headers.copy()
        if self.config.ADD_DEFAULT_HEADERS:
            headers = self._add_headers(headers)

        return self.api.check_cookies_valid(cookies, cookies_validation_url, headers)

    def _add_headers(self, headers: Optional[Dict] = None) -> Dict:
        default_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,fa;q=0.7",
            "Content-Type": "application/json",
            "Priority": "u=1, i",
            "Sec-CH-UA": '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": '"Windows"',
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
        }

        if headers:
            default_headers.update(headers)

        return default_headers

    def _mask_secret(self, value: Optional[str], keep: int = 2) -> str:
        if not value:
            return "<empty>"
        if len(value) <= keep * 2:
            return "*" * len(value)
        return f"{value[:keep]}***{value[-keep:]}"

    def _build_captcha_image_url(self, base_url: str, image_path: str) -> str:
        parsed = urlparse((image_path or "").strip())
        if parsed.scheme and parsed.netloc:
            return image_path
        normalized_base = (base_url or "").rstrip("/") + "/"
        return urljoin(normalized_base, (image_path or "").lstrip("/"))

    def login(
        self,
        mobile: str,
        password: str,
        max_retries: int,
        base_domain: str,
        login_url: str,
        get_captcha_info_url: str,
        get_captcha_image_base_url: str,
        verify_captcha_url: str,
        cookies_validation_url: str,
        headers: Optional[dict] = None,
    ) -> tuple[bool, Optional[dict]]:
        normalized_mobile = normalize_mobile(mobile)
        normalized_base_domain = normalize_domain_key(base_domain)
        self.logger.info(
            "[login] start mobile=%s base_domain=%s max_retries=%s",
            self._mask_secret(normalized_mobile),
            normalized_base_domain,
            max_retries,
        )
        self.logger.debug(
            "[login] urls login=%s captcha_info=%s captcha_img_base=%s verify=%s cookies_validation=%s",
            login_url,
            get_captcha_info_url,
            get_captcha_image_base_url,
            verify_captcha_url,
            cookies_validation_url,
        )

        login_data = self.redis_client.get_login_data(
            normalized_mobile, normalized_base_domain
        )
        self.logger.debug(
            "[login] redis lookup done found=%s keys=%s",
            bool(login_data),
            list(login_data.keys()) if login_data else [],
        )

        cookies = login_data.get("cookies", {}) if login_data else {}
        self.logger.debug(
            "[login] initial cookies count=%s cookie_keys=%s",
            len(cookies),
            list(cookies.keys()) if cookies else [],
        )

        is_cached_login_valid = self._validate_login_data(
            login_data, cookies_validation_url
        )
        self.logger.debug(
            "[login] cached login validation result=%s", is_cached_login_valid
        )
        if is_cached_login_valid:
            self.logger.info("[login] returning cached login data")
            return True, login_data

        if self.config.ADD_DEFAULT_HEADERS:
            self.logger.debug("[login] default headers enabled")
            headers = headers.copy() if headers else {}
            if cookies.get("csrftoken"):
                headers["X-Csrftoken"] = cookies.get("csrftoken", "")
            headers = self._add_headers(headers)
            self.logger.debug(
                "[login] headers prepared keys=%s",
                list(headers.keys()) if headers else [],
            )
        else:
            self.logger.debug("[login] default headers disabled")

        for attempt in range(1, max_retries + 1):
            self.logger.info("[login] attempt=%s/%s start", attempt, max_retries)
            captcha_key, image_path = self.api.get_captcha(
                get_captcha_info_url, cookies, headers
            )
            self.logger.debug(
                "[login] captcha fetched key=%s image_path=%s",
                self._mask_secret(captcha_key),
                image_path,
            )

            captcha_image_url = self._build_captcha_image_url(
                get_captcha_image_base_url, image_path
            )
            self.logger.debug("[login] captcha image url=%s", captcha_image_url)

            captcha_code = self.captcha_worker.solve(captcha_image_url)
            self.logger.debug(
                "[login] captcha solved code=%s", self._mask_secret(captcha_code)
            )

            verify_response = self.api.verify_captcha(
                captcha_key, captcha_code, verify_captcha_url, cookies, headers
            )
            self.logger.debug(
                "[login] captcha verify status=%s text=%s",
                verify_response.status_code,
                verify_response.text[:300],
            )

            data = verify_response.json()
            if verify_response.status_code == 400 and "اشتباه" in data.get("error", ""):
                self.logger.warning("[login] captcha incorrect, retrying")
                continue

            if verify_response.status_code != 200:
                self.logger.error(
                    "Captcha verification failed with status=%s text=%s verification_url=%s",
                    verify_response.status_code,
                    verify_response.text,
                    verify_captcha_url,
                )
                continue

            login_response = self.api.login(
                login_url, normalized_mobile, password, cookies, headers
            )
            self.logger.debug(
                "[login] login response status=%s text=%s cookies_now=%s",
                login_response.status_code,
                login_response.text[:300],
                list(cookies.keys()) if cookies else [],
            )

            if login_response.status_code == 200:
                self.logger.info("[login] login success, saving to redis")
                session_data = {
                    "cookies": cookies,
                    "headers": headers or {},
                }
                self.redis_client.save_login_data(
                    normalized_mobile,
                    session_data,
                    normalized_base_domain,
                    self.config.REDIS_TTL,
                )
                self.logger.info("[login] saved login data, returning success")
                return True, session_data

            if login_response.status_code == 400 and "اشتباه" in login_response.text:
                self.logger.warning(
                    "[login] invalid credentials mobile=%s password=%s",
                    self._mask_secret(mobile),
                    self._mask_secret(password),
                )
                self.logger.warning("Login failed due to incorrect credentials")
                return False, None

            self.logger.warning("[login] login did not succeed, continuing retries")

        self.logger.error("[login] exhausted all retries, returning failure")
        return False, None

    def logout(self, mobile: str, base_domain: str) -> bool:
        normalized_mobile = normalize_mobile(mobile)
        normalized_base_domain = normalize_domain_key(base_domain)
        if not normalized_mobile:
            return False
        deleted_count = self.redis_client.delete_login_data(
            normalized_mobile, normalized_base_domain
        )
        self.logger.info(
            "[logout] deleted_keys=%s mobile=%s base_domain=%s",
            deleted_count,
            self._mask_secret(normalized_mobile),
            normalized_base_domain,
        )
        return deleted_count > 0
