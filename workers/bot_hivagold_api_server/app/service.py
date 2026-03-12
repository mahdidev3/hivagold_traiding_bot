from typing import Dict, Any, Optional
import uuid
from datetime import datetime
from config import Config
from .clients import TenantUserDatabaseClient, BotAuthClient
from .models import TenantUser


class CreateUserService:
    """
    Service class for handling user creation.

    Handles the "create_user" action by:
    - Logging in via bot_auth_worker
    - Generating unique user_id and tenant_id
    - Storing user data in the database
    - Validating input parameters
    """

    def __init__(
        self,
        config: Config,
        tenant_user_db_client: TenantUserDatabaseClient,
        bot_auth_client: BotAuthClient,
    ):
        """
        Initialize the CreateUserService.

        Args:
            config: Configuration object
            tenant_user_db_client: Database client for storing tenant user data
            bot_auth_client: HTTP client for bot_auth_worker service
        """
        self.db_client = tenant_user_db_client
        self.config = config
        self.bot_auth_client = bot_auth_client

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the create_user action.

        Args:
            args: Dictionary containing:
                - password: str (user password)
                - namespace: str (namespace for the user)
                - annotations: Optional[Dict[str, str]] (user annotations)
                - labels: Optional[Dict[str, str]] (user labels)
                - scopes: List[str] (user scopes/permissions)

        Returns:
            Dictionary containing:
                - success: bool (whether creation was successful)
                - user_id: Optional[str] (generated user ID)
                - tenant_id: Optional[str] (generated tenant ID)
                - error: Optional[str] (error message if failed)
        """
        try:
            # Extract parameters
            password = args.get("password")
            namespace = args.get("namespace")
            annotations = args.get("annotations", {})
            labels = args.get("labels", {})
            scopes = args.get("scopes", [])

            hivagold_password = args.get("hivagold_password")
            hivagold_mobile = args.get("hivagold_mobile")

            # Validate required fields
            if not password:
                return {
                    "success": False,
                    "user_id": None,
                    "tenant_id": None,
                    "error": "Password is required",
                }

            if not namespace:
                return {
                    "success": False,
                    "user_id": None,
                    "tenant_id": None,
                    "error": "Namespace is required",
                }

            if not hivagold_mobile:
                return {
                    "success": False,
                    "user_id": None,
                    "tenant_id": None,
                    "error": "Hivagold mobile is required",
                }

            if not hivagold_password:
                hivagold_password = password

            # Authenticate user with bot_auth_worker
            login_response = await self.bot_auth_client.login(
                mobile=hivagold_mobile,
                password=hivagold_password,
            )

            # Validate login response
            if not login_response.get("success", False):
                return {
                    "success": False,
                    "user_id": None,
                    "tenant_id": None,
                    "error": login_response.get("error", "Login failed"),
                }

            # Generate unique IDs
            user_id = str(uuid.uuid4())
            tenant_id = "placeholder"  # the db client will replace this

            # Prepare user data for storage
            tenant_user = TenantUser(
                user_id=user_id,
                tenant_id=tenant_id,
                namespace=namespace,
                password=password,
                annotations=annotations,
                labels=labels,
                scopes=scopes,
                created_at=datetime.utcnow().isoformat(),
            )

            await self.db_client.create_hivagold_user(tenant_user)

            return {
                "success": True,
                "user_id": user_id,
                "tenant_id": tenant_id,
            }

        except Exception as e:
            return {
                "success": False,
                "user_id": None,
                "tenant_id": None,
                "error": str(e),
            }


class GetUsersService:
    """
    Service class for handling user retrieval with advanced filtering.

    Handles the "get_users" action by:
    - Applying label selectors for label-based filtering
    - Applying annotation selectors for annotation-based filtering
    - Filtering by scopes (scopesIn and scopesNotIn)
    - Filtering by exact user_id and namespace matches
    """

    def __init__(self, config: Config, tenant_user_db_client: TenantUserDatabaseClient):
        """
        Initialize the GetUsersService.

        Args:
            config: Configuration object
            tenant_user_db_client: Database client for retrieving tenant user data
        """
        self.db_client = tenant_user_db_client
        self.config = config

    async def execute(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the get_users action with advanced filtering.

        Args:
            args: Dictionary containing:
                - filters: Dict[str, Any] (filtering criteria)
                  - user_id: Optional[str] - Exact user ID match
                  - namespace: Optional[str] - Exact namespace match
                  - labelSelector: Optional[dict]
                    - matchLabels: Optional[Dict[str, str]]
                    - matchExpressions: Optional[List[Dict]] with operators: In, NotIn, Exists, DoesNotExist
                  - annotationSelector: Optional[dict]
                    - matchLabels: Optional[Dict[str, str]]
                    - matchExpressions: Optional[List[Dict]] with operators: In, NotIn, Exists, DoesNotExist
                  - scopesIn: Optional[List[str]] - Match users with ANY of these scopes
                  - scopesNotIn: Optional[List[str]] - Match users without ANY of these scopes

        Returns:
            Dictionary containing:
                - success: bool (whether retrieval was successful)
                - users: List[Dict[str, Any]] (list of user data matching filters)
                - error: Optional[str] (error message if failed)
        """
        try:
            # Extract filters from args
            filters = args.get("filters", {})

            # Retrieve users from database with applied filters
            users = await self.db_client.get_hivagold_users(filters)

            # Convert TenantUser objects to dictionaries
            user_dicts = []
            for user in users:
                user_dicts.append(
                    {
                        "tenant_id": user.tenant_id,
                        "user_id": user.user_id,
                        "namespace": user.namespace,
                        "annotations": user.annotations or {},
                        "labels": user.labels or {},
                        "scopes": user.scopes or [],
                    }
                )

            return {
                "success": True,
                "users": user_dicts,
            }

        except Exception as e:
            return {
                "success": False,
                "users": [],
                "error": str(e),
            }


class ApiService:
    """
    Main API service that orchestrates all operations.

    Handles routing of different action types to appropriate service handlers:
    - create_user: Routes to CreateUserService
    - get_users: Routes to GetUsersService
    """

    def __init__(
        self, create_user_service: CreateUserService, get_users_service: GetUsersService
    ):
        """
        Initialize the ApiService.

        Args:
            create_user_service: Service for handling user creation
            get_users_service: Service for handling user retrieval
        """
        self.create_user_service = create_user_service
        self.get_users_service = get_users_service

    async def process(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process API requests and route to appropriate service handler.

        Args:
            args: Dictionary containing:
                - action: str (the action to perform: "create_user" or "get_users")
                - Additional parameters specific to the action

        Returns:
            Dictionary containing the result of the action
        """
        try:
            action = args.get("action")

            if action == "create_user":
                return await self.create_user_service.execute(args)
            elif action == "get_users":
                return await self.get_users_service.execute(args)
            else:
                return {
                    "success": False,
                    "error": f"Unknown action: {action}",
                }

        except Exception as e:
            return {
                "success": False,
                "error": f"Error processing request: {str(e)}",
            }
