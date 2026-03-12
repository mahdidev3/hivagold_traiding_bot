from contextlib import asynccontextmanager
import requests

from .schemas import (
    HealthResponse,
    CreateUserRequest,
    CreateUserResponse,
    GetUserRequest,
    GetUserResponse,
    GetUsersResponse,
    GetUserReques,
)
from config import get_config
from .clients import build_clients
from .service import ApiService, CreateUserService, GetUsersService
from .queue_manager import ApiQueueManager
from fastapi import FastAPI, File, HTTPException, UploadFile
from typing import Dict, Any


config = get_config()

hivagold_redis_client, tenant_user_db_client, bot_auth_client = build_clients(config)

# Initialize services
create_user_service = CreateUserService(config, tenant_user_db_client, bot_auth_client)
get_users_service = GetUsersService(config, tenant_user_db_client)
api_service = ApiService(create_user_service, get_users_service)

queue_manager = ApiQueueManager(api_service)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await queue_manager.start()
    yield
    await queue_manager.stop()


app = FastAPI(
    title=config.APP_NAME,
    version=config.APP_VERSION,
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# Endpoint: GET /health
#
# Purpose:
# - Check whether this worker process is alive.
#
# Response:
#   - status: "healthy" or "unhealthy"
#   - app_name: Name of the application
#   - version: Version of the application
# ------------------------------------------------------------------
@app.get("/health", response_model=HealthResponse)
async def health():
    """
    Health check endpoint.

    Returns:
        HealthResponse: Status, app name, and version
    """
    return HealthResponse(
        status="healthy",
        app_name=config.APP_NAME,
        version=config.APP_VERSION,
    )


# ------------------------------------------------------------------
# Endpoint: POST /users
#
# Purpose:
# - Create a new user.
#
# Request:
# - password: str
# - namespace: str
# - annotations: Optional[Dict[str, str]]
# - labels: Optional[Dict[str, str]]
# - scopes: List[str]
#
# Response:
# - success: bool
# - user_id: Optional[str]
# - tenant_id: Optional[str]
# ------------------------------------------------------------------
@app.post("/users", response_model=CreateUserResponse)
async def create_user(request: CreateUserRequest):
    args: Dict[str, Any] = {
        "action": "create_user",
        "password": request.password,
        "namespace": request.namespace,
        "annotations": request.annotations,
        "labels": request.labels,
        "scopes": request.scopes,
        "hivagold_password": request.hivagold_password,
        "hivagold_mobile": request.hivagold_mobile,
    }
    result = await queue_manager.enqueue(args)
    return CreateUserResponse(
        success=result.get("success", False),
        user_id=result.get("user_id"),
        tenant_id=result.get("tenant_id"),
    )


# ------------------------------------------------------------------
# Endpoint: GET /users
#
# Purpose:
# - Retrieve users with advanced filtering using label/annotation selectors.
#
# Filtering Options (all optional):
#
# 1. Equality Selectors:
#    - user_id: str (exact match on user ID)
#      Example: user_id="user123"
#
#    - namespace: str (exact match on namespace)
#      Example: namespace="default"
#
# 2. Label Selectors (for labels field):
#    - labelSelector.matchLabels: Dict[str, str]
#      Exact key-value matching (AND logic for multiple)
#      Example: matchLabels={"app": "bot", "env": "prod"}
#               Returns users with BOTH app=bot AND env=prod
#
#    - labelSelector.matchExpressions: List[Dict]
#      Advanced set-based matching with operators: In, NotIn, Exists, DoesNotExist
#      Example: [
#        {"key": "app", "operator": "In", "values": ["bot", "worker"]},
#        {"key": "tier", "operator": "NotIn", "values": ["alpha"]},
#        {"key": "env", "operator": "Exists"},
#        {"key": "deprecated", "operator": "DoesNotExist"}
#      ]
#
# 3. Annotation Selectors (for annotations field):
#    - annotationSelector.matchLabels: Dict[str, str]
#      Exact key-value matching
#      Example: matchLabels={"version": "1.0", "owner": "team-a"}
#
#    - annotationSelector.matchExpressions: List[Dict]
#      Advanced set-based matching (same operators as labelSelector)
#      Example: [{"key": "version", "operator": "In", "values": ["1.0", "2.0"]}]
#
# 4. Scopes Filters (for scopes field):
#    - scopesIn: List[str]
#      Returns users whose scopes contain ANY of the specified values
#      Example: scopesIn=["read", "write"]
#               Returns users with scopes including "read" OR "write"
#
#    - scopesNotIn: List[str]
#      Returns users whose scopes DO NOT contain any of the specified values
#      Example: scopesNotIn=["admin", "delete"]
#               Returns users without "admin" or "delete" scopes
#
# Example Requests:
# {
#   "user_id": "user123",
#   "namespace": "production"
# }
#
# {
#   "labelSelector": {
#     "matchLabels": {"app": "bot"},
#     "matchExpressions": [
#       {"key": "env", "operator": "In", "values": ["prod", "staging"]}
#     ]
#   },
#   "scopesIn": ["read"]
# }
#
# {
#   "annotationSelector": {
#     "matchLabels": {"owner": "team-a"}
#   },
#   "scopesNotIn": ["admin"]
# }
#
# Response:
# - users: List[GetUserResponse] (filtered results)
# ------------------------------------------------------------------
@app.get("/users", response_model=GetUsersResponse)
async def get_users(request: GetUserReques):
    args: Dict[str, Any] = {
        "action": "get_users",
        "filters": {
            "user_id": request.user_id,
            "namespace": request.namespace,
            "labelSelector": request.labelSelector.dict()
            if request.labelSelector
            else None,
            "annotationSelector": request.annotationSelector.dict()
            if request.annotationSelector
            else None,
            "scopesIn": request.scopesIn,
            "scopesNotIn": request.scopesNotIn,
        },
    }
    result = await queue_manager.enqueue(args)
    users = []
    for user_data in result.get("users", []):
        users.append(
            GetUserResponse(
                tenant_id=user_data.get("tenant_id"),
                user_id=user_data.get("user_id"),
                namespace=user_data.get("namespace"),
                annotations=user_data.get("annotations", {}),
                labels=user_data.get("labels", {}),
                scopes=user_data.get("scopes", []),
            )
        )
    return GetUsersResponse(users=users)
