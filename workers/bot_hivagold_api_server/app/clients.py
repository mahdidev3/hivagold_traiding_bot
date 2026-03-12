import logging
import os
from typing import Any, Optional, Tuple
from .models import TenantUser
from .secrets import encrypt_password, get_public_key_from_pem
import redis
import json
import requests
from config import Config
import asyncpg
from pymongo import ASCENDING
from pymongo.asynchronous.mongo_client import AsyncMongoClient
from pymongo.errors import DuplicateKeyError


class HivagoldRedisClient:
    def __init__(self, redis_pool: redis.ConnectionPool):
        self.redis_pool = redis_pool

    def _redis_connection(self) -> redis.Redis:
        return redis.Redis(connection_pool=self.redis_pool, decode_responses=True)


class BotAuthClient:
    """
    HTTP client for communicating with bot_auth_worker service.
    """

    def __init__(self, login_url: str):
        if not login_url:
            raise ValueError("Bot login URL is not provided")
        self.login_url = login_url.rstrip("/")
        self.logger = logging.getLogger(__name__)

    async def login(self, mobile: str, password: str) -> dict:
        """
        Send login request to bot_auth_worker service.

        Args:
            mobile: User mobile number
            password: User password

        Returns:
            Dictionary containing login response data
        """
        try:
            login_endpoint = f"{self.login_url}/login"
            payload = {
                "mobile": mobile,
                "password": password,
            }

            response = requests.post(login_endpoint, json=payload, timeout=10)
            response.raise_for_status()

            return response.json()
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Login request failed: {str(e)}")
            raise ValueError(f"Failed to authenticate with bot_auth_worker: {str(e)}")


class TenantUserDatabaseClient:
    """
    MongoDB client for tenant users information.
    """

    def __init__(
        self,
        hivagold_tenant_uuid: str,
        public_key_pem: str,
        dsn: Optional[str],
        database_name: str,
        collection_name: str,
    ):
        if not dsn:
            raise ValueError("MongoDB DSN is not provided")
        if not database_name:
            raise ValueError("MongoDB database name is not provided")
        if not hivagold_tenant_uuid:
            raise ValueError("Hivagold tenant UUID not provided")

        self._dsn = dsn
        self._hivagold_tenant_uuid = hivagold_tenant_uuid
        self._database_name = database_name
        self._collection_name = collection_name
        self._client: Optional[AsyncMongoClient] = None
        self._public_key = get_public_key_from_pem(public_key_pem)

    def _get_collection(self):
        if self._client is None:
            raise RuntimeError(
                "Database client is not initialized. Call connect() first."
            )
        return self._client[self._database_name][self._collection_name]

    async def connect(self) -> None:
        if self._client is None:
            self._client = AsyncMongoClient(self._dsn)

            collection = self._client[self._database_name][self._collection_name]

            # Ensure uniqueness for one tenant user in one namespace
            await collection.create_index(
                [
                    ("tenant_id", ASCENDING),
                    ("user_id", ASCENDING),
                    ("namespace", ASCENDING),
                ],
                unique=True,
                name="uniq_tenant_user_namespace",
            )

    async def close(self) -> None:
        if self._client is not None:
            await self._client.close()
            self._client = None

    async def create_hivagold_user(self, tenant_user: "TenantUser") -> None:
        collection = self._get_collection()

        payload = tenant_user.model_copy()

        if payload.password:
            payload.password = encrypt_password(payload.password, self._public_key)

        payload.tenant_id = self._hivagold_tenant_uuid

        document = payload.model_dump()

        try:
            await collection.insert_one(document)
        except DuplicateKeyError as exc:
            raise ValueError(
                "Tenant user already exists for this tenant_id, user_id, and namespace."
            ) from exc

    async def get_hivagold_users(self, filters: dict) -> list["TenantUser"]:
        """
        Retrieve users from the database with advanced filtering.

        Args:
            filters: Dictionary containing:
                - user_id: Optional[str] - Exact user ID match
                - namespace: Optional[str] - Exact namespace match
                - labelSelector: Optional[dict] - Label selector with matchLabels and/or matchExpressions
                - annotationSelector: Optional[dict] - Annotation selector with matchLabels and/or matchExpressions
                - scopesIn: Optional[List[str]] - Match users with ANY of these scopes
                - scopesNotIn: Optional[List[str]] - Match users without ANY of these scopes

        Returns:
            List of TenantUser objects matching the filters

        Operators supported in matchExpressions:
            - In: key must have one of the specified values
            - NotIn: key must not have any of the specified values
            - Exists: key must exist (values field ignored)
            - DoesNotExist: key must not exist (values field ignored)
        """
        collection = self._get_collection()

        # Build MongoDB query
        query = {"tenant_id": self._hivagold_tenant_uuid}

        # Add equality filters
        if filters.get("user_id"):
            query["user_id"] = filters["user_id"]

        if filters.get("namespace"):
            query["namespace"] = filters["namespace"]

        # Add label selector filters
        label_selector = filters.get("labelSelector")
        if label_selector:
            # matchLabels: exact match
            match_labels = label_selector.get("matchLabels", {})
            for key, value in match_labels.items():
                query[f"labels.{key}"] = value

            # matchExpressions: advanced matching
            match_expressions = label_selector.get("matchExpressions", [])
            for expr in match_expressions:
                key = expr.get("key")
                operator = expr.get("operator")
                values = expr.get("values", [])

                if operator == "In":
                    query[f"labels.{key}"] = {"$in": values}
                elif operator == "NotIn":
                    query[f"labels.{key}"] = {"$nin": values}
                elif operator == "Exists":
                    query[f"labels.{key}"] = {"$exists": True}
                elif operator == "DoesNotExist":
                    query[f"labels.{key}"] = {"$exists": False}

        # Add annotation selector filters
        annotation_selector = filters.get("annotationSelector")
        if annotation_selector:
            # matchLabels: exact match
            match_labels = annotation_selector.get("matchLabels", {})
            for key, value in match_labels.items():
                query[f"annotations.{key}"] = value

            # matchExpressions: advanced matching
            match_expressions = annotation_selector.get("matchExpressions", [])
            for expr in match_expressions:
                key = expr.get("key")
                operator = expr.get("operator")
                values = expr.get("values", [])

                if operator == "In":
                    query[f"annotations.{key}"] = {"$in": values}
                elif operator == "NotIn":
                    query[f"annotations.{key}"] = {"$nin": values}
                elif operator == "Exists":
                    query[f"annotations.{key}"] = {"$exists": True}
                elif operator == "DoesNotExist":
                    query[f"annotations.{key}"] = {"$exists": False}

        # Add scopes filters
        scopes_in = filters.get("scopesIn", [])
        scopes_not_in = filters.get("scopesNotIn", [])

        if scopes_in and scopes_not_in:
            # User scopes must include ANY from scopesIn AND NOT include ANY from scopesNotIn
            query["scopes"] = {"$in": scopes_in, "$nin": scopes_not_in}
        elif scopes_in:
            # User scopes must include ANY from scopesIn
            query["scopes"] = {"$in": scopes_in}
        elif scopes_not_in:
            # User scopes must NOT include ANY from scopesNotIn
            query["scopes"] = {"$nin": scopes_not_in}

        # Execute query and return results
        users = []
        async for document in collection.find(query, {"_id": 0}):
            users.append(TenantUser(**document))

        return users


def build_clients(
    config: Config,
) -> Tuple[HivagoldRedisClient, TenantUserDatabaseClient, BotAuthClient]:
    """
    Build service clients from configuration.

    Returns:
        Tuple of (HivagoldRedisClient, TenantUserDatabaseClient, BotAuthClient)
    """
    redis_host = config.HIVAGOLD_REDIS_HOST
    redis_port = config.HIVAGOLD_REDIS_PORT
    redis_db = config.HIVAGOLD_REDIS_DB
    redis_password = config.HIVAGOLD_REDIS_PASSWORD

    redis_pool = redis.ConnectionPool(
        host=redis_host,
        port=redis_port,
        db=redis_db,
        password=redis_password,
        decode_responses=True,
    )

    tenant_user_db_client = TenantUserDatabaseClient(
        hivagold_tenant_uuid=config.HIVAGOLD_TENANT_ID,
        public_key_pem=config.PUBLIC_KEY_PEM,
        dsn=config.Tenants_MONGODB_DSN,
        database_name=config.Tenants_MONGODB_DATABASE,
        collection_name=config.Tenants_MONGODB_COLLECTION,
    )

    hivagold_redis_client = HivagoldRedisClient(redis_pool)

    bot_auth_client = BotAuthClient(login_url=config.HIVAGOLD_BOT_AUTH_URL)

    return hivagold_redis_client, tenant_user_db_client, bot_auth_client
