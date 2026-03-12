from pydantic import BaseModel, Field
from typing import Dict, Optional, List


class LabelSelectorExpression(BaseModel):
    """
    Label selector expression for set-based matching.
    """

    key: str
    operator: str = Field(description="In, NotIn, Exists, DoesNotExist")
    values: Optional[List[str]] = Field(default_factory=list)


class LabelSelector(BaseModel):
    """
    Label selector for filtering by labels.
    """

    matchLabels: Optional[Dict[str, str]] = Field(default_factory=dict)
    matchExpressions: Optional[List[LabelSelectorExpression]] = Field(
        default_factory=list
    )


class AnnotationSelector(BaseModel):
    """
    Annotation selector for filtering by annotations.
    """

    matchLabels: Optional[Dict[str, str]] = Field(default_factory=dict)
    matchExpressions: Optional[List[LabelSelectorExpression]] = Field(
        default_factory=list
    )


class CreateUserRequest(BaseModel):
    """
    Request model for creating a new user.
    """

    password: str
    namespace: str
    annotations: Optional[Dict[str, str]] = Field(default_factory=dict)
    labels: Optional[Dict[str, str]] = Field(default_factory=dict)
    scopes: List[str] = Field(default_factory=list)

    hivagold_mobile: str
    hivagold_password: Optional[str] = None


class CreateUserResponse(BaseModel):
    """
    Response model for creating a new user.
    """

    success: bool
    user_id: Optional[str] = None
    tenant_id: Optional[str] = None


class GetUserRequest(BaseModel):
    """
    Request model for retrieving a user.
    """

    tenant_id: str
    user_id: str
    namespace: str


class GetUserResponse(BaseModel):
    """
    Response model for retrieving a user.
    """

    tenant_id: str
    user_id: str
    namespace: str
    annotations: Optional[Dict[str, str]] = Field(default_factory=dict)
    labels: Optional[Dict[str, str]] = Field(default_factory=dict)
    scopes: List[str] = Field(default_factory=list)


class GetUsersResponse(BaseModel):
    """
    Response model for retrieving multiple users.
    """

    users: List[GetUserResponse] = Field(default_factory=list)


class GetUserReques(BaseModel):
    """
    Request model for filtering users with advanced selectors.

    Filtering Options (all optional):

    1. Equality Selectors:
       - user_id: str (exact match on user ID)
       - namespace: str (exact match on namespace)

    2. Label Selectors:
       - labelSelector: LabelSelector
         - matchLabels: exact key-value matching (AND logic)
         - matchExpressions: advanced set-based matching with operators (In, NotIn, Exists, DoesNotExist)

    3. Annotation Selectors:
       - annotationSelector: AnnotationSelector
         - matchLabels: exact key-value matching
         - matchExpressions: advanced set-based matching

    4. Scopes Filters:
       - scopesIn: returns users whose scopes contain ANY of the specified values
       - scopesNotIn: returns users whose scopes DO NOT contain any of the specified values
    """

    user_id: Optional[str] = None
    namespace: Optional[str] = None
    labelSelector: Optional[LabelSelector] = None
    annotationSelector: Optional[AnnotationSelector] = None
    scopesIn: Optional[List[str]] = Field(default_factory=list)
    scopesNotIn: Optional[List[str]] = Field(default_factory=list)


class HealthResponse(BaseModel):
    """
    Response model for health check endpoint.
    """

    status: str = Field(description="Health status: 'healthy' or 'unhealthy'")
    app_name: str = Field(description="Application name")
    version: str = Field(description="Application version")
