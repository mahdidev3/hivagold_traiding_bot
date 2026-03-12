from typing import Optional
from pydantic import BaseModel, Field


class TenantUser(BaseModel):
    tenant_id: str
    user_id: str
    annotations: Optional[dict[str, str]] = Field(default_factory=dict)
    labels: Optional[dict[str, str]] = Field(default_factory=dict)
    password: Optional[str] = None
    namespace: str
    scopes: list[str] = Field(default_factory=list)
    created_at: str
