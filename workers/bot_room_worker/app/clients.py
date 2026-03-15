import logging
from typing import Any, Dict, Optional, Tuple
from pathlib import Path
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


class HivagoldRedisClient:
    """Backward-compatible JSON session storage client."""

    def __init__(self, cache_file: Path, logger: logging.Logger):
        self.cache_file = cache_file
        self.logger = logger
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)

    def _read(self) -> Dict[str, Any]:
        if not self.cache_file.exists():
            return {}
        try:
            data = json.loads(self.cache_file.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except Exception:
            return {}

    def _write(self, data: Dict[str, Any]) -> None:
        self.cache_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def save_session_data(
        self, mobile: str, session_data: Dict[str, Any], base_domain: str, ttl: int
    ) -> bool:
        """
        Save session data (cookies, headers) in JSON cache as JSON.

        Args:
            mobile: User mobile number
            session_data: Dictionary containing cookies and headers
            base_domain: Base domain for the key
            ttl: Time to live in seconds

        Returns:
            Boolean indicating success
        """
        try:
            all_data = self._read()
            normalized_mobile = normalize_mobile(mobile)
            normalized_domain = normalize_domain_key(base_domain)
            _ = ttl
            all_data[f"{normalized_domain}:{normalized_mobile}"] = session_data
            self._write(all_data)
            self.logger.info(f"Saved session data for {mobile} in JSON cache")
            return True
        except Exception as e:
            self.logger.error(f"Failed to save session data in JSON cache: {str(e)}")
            return False

    def get_session_data(
        self, mobile: str, base_domain: str
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve session data from JSON cache.

        Args:
            mobile: User mobile number
            base_domain: Base domain for the key

        Returns:
            Dictionary containing session data or None if not found
        """
        try:
            all_data = self._read()
            normalized_mobile = normalize_mobile(mobile)
            mobile_candidates = [normalized_mobile, (mobile or "").strip()]
            for domain_candidate in domain_key_candidates(base_domain):
                for mobile_candidate in mobile_candidates:
                    if not mobile_candidate:
                        continue
                    redis_key = f"{domain_candidate}:{mobile_candidate}"
                    self.logger.info(redis_key)
                    data = all_data.get(redis_key)
                    if not data:
                        continue
                    session_data = json.loads(data)
                    self.logger.debug(f"Retrieved session data for {mobile} from JSON cache")
                    return session_data
            self.logger.debug(f"No session data found for {mobile} in JSON cache")
            return None
        except Exception as e:
            self.logger.error(f"Failed to retrieve session data from JSON cache: {str(e)}")
            return None

    def delete_session_data(self, mobile: str, base_domain: str) -> bool:
        """
        Delete session data from JSON cache.

        Args:
            mobile: User mobile number
            base_domain: Base domain for the key

        Returns:
            Boolean indicating success
        """
        try:
            all_data = self._read()
            normalized_mobile = normalize_mobile(mobile)
            mobile_candidates = [normalized_mobile, (mobile or "").strip()]
            redis_keys: list[str] = []
            for domain_candidate in domain_key_candidates(base_domain):
                for mobile_candidate in mobile_candidates:
                    if mobile_candidate:
                        redis_keys.append(f"{domain_candidate}:{mobile_candidate}")
            unique_keys: list[str] = []
            for key in redis_keys:
                if key not in unique_keys:
                    unique_keys.append(key)
            if not unique_keys:
                return False
            deleted = 0
            for key in unique_keys:
                if key in all_data:
                    deleted += 1
                    all_data.pop(key, None)
            self._write(all_data)
            self.logger.info(f"Deleted session data for {mobile} from JSON cache")
            return bool(deleted)
        except Exception as e:
            self.logger.error(f"Failed to delete session data from JSON cache: {str(e)}")
            return False


class PortfolioClient:
    """
    HTTP client for communicating with portfolio service.
    Handles portfolio creation, management, and balance operations.
    Manages cookies from JSON cache and updates them after each request.
    """

    def __init__(
        self, redis_client: HivagoldRedisClient, config: Config, logger: logging.Logger
    ):
        self.logger = logger
        self.redis_client = redis_client
        self.config = config

    def _update_cookies_from_response(
        self,
        response: requests.Response,
        cookies: Optional[dict],
        headers: Optional[dict],
    ) -> None:
        """
        Update cookies and headers from HTTP response.
        Also updates CSRF token in headers if present.
        """
        if response.cookies is None or cookies is None:
            return

        for cookie in response.cookies:
            cookies[cookie.name] = cookie.value

        # If csrf token is in cookies, also add it to headers for next requests
        if "csrftoken" in cookies:
            if headers is not None:
                headers["X-Csrftoken"] = cookies["csrftoken"]

    def _handle_error_response(self, response: requests.Response, context: str) -> None:
        """
        Log error responses from external API.

        Args:
            response: HTTP response object
            context: Context description for logging
        """
        try:
            error_content = response.text
            self.logger.error(
                f"Error {response.status_code} in {context}: {error_content}"
            )
        except Exception as e:
            self.logger.error(f"Error {response.status_code} in {context}: {str(e)}")

    def _parse_response_json(self, response: requests.Response) -> Dict[str, Any]:
        try:
            return response.json()
        except ValueError:
            return {"raw": response.text}

    def get_portfolios(
        self,
        get_url: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Get list of portfolios.

        Args:
            get_url: URL endpoint to retrieve portfolios
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing portfolios data

        Raises:
            ValueError: If request fails
        """
        try:
            response = requests.get(
                get_url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "get_portfolios")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to get portfolios: {str(e)}")
            raise ValueError(f"Failed to retrieve portfolios: {str(e)}")

    def create_portfolio(
        self,
        create_url: str,
        portfolio_type: str,
        initial_balance: float,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new portfolio.

        Args:
            create_url: URL endpoint to create portfolio
            portfolio_type: Portfolio type (e.g. isolated)
            initial_balance: Initial portfolio balance
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing created portfolio data

        Raises:
            ValueError: If request fails
        """
        try:
            payload = {
                "initial_balance": initial_balance,
                "portfolio_type": portfolio_type,
            }

            response = requests.post(
                create_url,
                json=payload,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "create_portfolio")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to create portfolio: {str(e)}")
            raise ValueError(f"Failed to create portfolio: {str(e)}")

    def get_transactions(
        self,
        get_url: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Get portfolio transactions.

        Args:
            get_url: URL endpoint to retrieve transactions
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing transactions data

        Raises:
            ValueError: If request fails
        """
        try:
            response = requests.get(
                get_url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "get_transactions")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to get transactions: {str(e)}")
            raise ValueError(f"Failed to retrieve transactions: {str(e)}")

    def close_transaction(
        self,
        close_url: str,
        transaction_id: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Close an open transaction.

        Args:
            close_url: Base URL endpoint to close transaction (transaction_id will be appended)
            transaction_id: ID of the transaction to close
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing the response from transaction closure

        Raises:
            ValueError: If request fails
        """
        try:
            url = f"{close_url.rstrip('/')}/{transaction_id}/"
            response = requests.post(
                url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            if response.status_code == 400:
                self._handle_error_response(response, "close_transaction")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            self._update_cookies_from_response(response, cookies, headers)

            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to close transaction: {str(e)}")
            raise ValueError(f"Failed to close transaction: {str(e)}")

    def close_portfolio(
        self,
        close_url: str,
        portfolio_id: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Close a portfolio.

        Args:
            close_url: URL endpoint to close a portfolio
            portfolio_id: ID of the portfolio to close
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing the response from portfolio closure

        Raises:
            ValueError: If request fails
        """
        try:
            response = requests.post(
                close_url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "close_portfolio")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to close portfolio: {str(e)}")
            raise ValueError(f"Failed to close portfolio: {str(e)}")

    def increase_balance(
        self,
        increase_url: str,
        portfolio_id: str,
        amount: float,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Increase the balance of a portfolio.

        Args:
            increase_url: URL endpoint to increase balance
            portfolio_id: ID of the portfolio
            amount: Amount to increase the balance by
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing the response from balance increase operation

        Raises:
            ValueError: If request fails
        """
        try:
            payload = {"portfolio_id": portfolio_id, "amount": amount}

            response = requests.post(
                increase_url,
                json=payload,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "increase_balance")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to increase portfolio balance: {str(e)}")
            raise ValueError(f"Failed to increase portfolio balance: {str(e)}")


class OrdersClient:
    """
    HTTP client for communicating with orders service.
    Handles order creation, retrieval, and closure operations.
    Manages cookies from JSON cache and updates them after each request.
    """

    def __init__(
        self, redis_client: HivagoldRedisClient, config: Config, logger: logging.Logger
    ):
        self.logger = logger
        self.redis_client = redis_client
        self.config = config

    def _update_cookies_from_response(
        self,
        response: requests.Response,
        cookies: Optional[dict],
        headers: Optional[dict],
    ) -> None:
        """
        Update cookies and headers from HTTP response.
        Also updates CSRF token in headers if present.
        """
        if response.cookies is None or cookies is None:
            return

        for cookie in response.cookies:
            cookies[cookie.name] = cookie.value

        # If csrf token is in cookies, also add it to headers for next requests
        if "csrftoken" in cookies:
            if headers is not None:
                headers["X-Csrftoken"] = cookies["csrftoken"]

    def _handle_error_response(self, response: requests.Response, context: str) -> None:
        """
        Log error responses from external API.

        Args:
            response: HTTP response object
            context: Context description for logging
        """
        try:
            error_content = response.text
            self.logger.error(
                f"Error {response.status_code} in {context}: {error_content}"
            )
        except Exception as e:
            self.logger.error(f"Error {response.status_code} in {context}: {str(e)}")

    def _parse_response_json(self, response: requests.Response) -> Dict[str, Any]:
        try:
            return response.json()
        except ValueError:
            return {"raw": response.text}

    def create_order(
        self,
        create_url: str,
        order_type: str,
        action: str,
        units: float,
        mobile: str,
        base_domain: str,
        price: Optional[float] = None,
        stop_loss: Optional[float] = None,
        take_profit: Optional[float] = None,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Create a new order.

        Args:
            create_url: URL endpoint for order creation
            order_type: Type of order to create ("limit" or "verbal")
            action: Action for the order (e.g., buy, sell)
            units: Number of units for the order
            mobile: User mobile number
            base_domain: Base domain for Redis key
            price: Price for limit orders (required if order_type is "limit")
            stop_loss: Optional stop loss price
            take_profit: Optional take profit price
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing the response from order creation

        Raises:
            ValueError: If order_type is "limit" but price is not provided
        """
        try:
            # Validate order type and required fields
            if order_type == "limit" and price is None:
                raise ValueError("Price is required for limit orders")

            # Build payload based on order type
            payload = {
                "order_type": order_type,
                "action": action,
                "units": units,
            }

            # Add price for limit orders
            if order_type == "limit" and price is not None:
                payload["price"] = price

            # Add optional stop_loss and take_profit if provided
            if stop_loss is not None:
                payload["stop_loss"] = stop_loss

            if take_profit is not None:
                payload["take_profit"] = take_profit

            response = requests.post(
                create_url,
                json=payload,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )
            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "create_order")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Order creation failed: {str(e)}")
            raise ValueError(f"Failed to create order: {str(e)}")

    def get_active_orders(
        self,
        get_url: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Get active orders.

        Args:
            get_url: URL endpoint to retrieve active orders
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing active orders data

        Raises:
            ValueError: If request fails
        """
        try:
            response = requests.get(
                get_url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "get_active_orders")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to get active orders: {str(e)}")
            raise ValueError(f"Failed to retrieve active orders: {str(e)}")

    def close_order(
        self,
        close_url: str,
        order_id: str,
        mobile: str,
        base_domain: str,
        cookies: Optional[Dict[str, str]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Close an order.

        Args:
            close_url: URL endpoint to close an order (order_id will be appended to this URL)
            order_id: ID of the order to close
            mobile: User mobile number
            base_domain: Base domain for Redis key
            cookies: Optional cookies for the request
            headers: Optional headers for the request

        Returns:
            Dictionary containing the response from order closure

        Raises:
            ValueError: If request fails
        """
        try:
            # Append order_id to the URL
            url = f"{close_url.rstrip('/')}/{order_id}/"

            response = requests.post(
                url,
                cookies=cookies,
                headers=headers,
                timeout=10,
            )

            # Handle 400 errors by logging and raising
            if response.status_code == 400:
                self._handle_error_response(response, "close_order")
                raise ValueError(f"Bad request (400): {response.text}")

            response.raise_for_status()

            # Update cookies from response
            self._update_cookies_from_response(response, cookies, headers)

            # Save updated session data to Redis
            if mobile and cookies:
                session_data = {"cookies": cookies}
                if headers:
                    session_data["headers"] = headers
                self.redis_client.save_session_data(
                    mobile, session_data, base_domain, self.config.SESSION_CACHE_TTL
                )

            return self._parse_response_json(response)
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Failed to close order: {str(e)}")
            raise ValueError(f"Failed to close order: {str(e)}")


def build_clients(
    config: Config,
    logger: logging.Logger,
) -> Tuple[HivagoldRedisClient, PortfolioClient, OrdersClient]:
    """
    Build and initialize client instances.

    Args:
        config: Configuration object containing client settings

    Returns:
        Tuple containing (session_cache_client, portfolio_client, orders_client)
    """
    cache_file = Path(getattr(config, "SESSION_CACHE_FILE", "data/room_sessions.json"))
    redis_client = HivagoldRedisClient(cache_file, logger)
    portfolio_client = PortfolioClient(redis_client, config, logger)
    orders_client = OrdersClient(redis_client, config, logger)

    return redis_client, portfolio_client, orders_client
