from pydantic import BaseModel, Field
from typing import Optional


class LoginRequest(BaseModel):
    """
    Request payload for login.

    Fields:
    - mobile: user mobile number
    - password: user password
    """

    mobile: str
    password: str
    max_retries: int = 3
    base_domain: Optional[str] = None
    login_url: Optional[str] = None
    get_captcha_info_url: Optional[str] = None
    get_captcha_image_base_url: Optional[str] = None
    verify_captcha_url: Optional[str] = None
    cookies_validation_url: Optional[str] = None


class LoginResponse(BaseModel):
    """
    Login result returned by auth worker.

    Fields:
    - success: whether login succeeded
    """

    success: bool


class LogoutRequest(BaseModel):
    mobile: str
    base_domain: Optional[str] = None


class LogoutResponse(BaseModel):
    success: bool


class HealthResponse(BaseModel):
    """
    Response model for health check endpoint.
    """

    status: str = Field(description="Health status: 'healthy' or 'unhealthy'")
    app_name: str = Field(description="Application name")
    version: str = Field(description="Application version")
