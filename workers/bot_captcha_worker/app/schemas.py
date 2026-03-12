from pydantic import BaseModel, Field


class SolveResponse(BaseModel):
    """
    Response returned after solving a captcha image.

    Fields:
    - code: extracted captcha code
    """

    code: str


class SolveRequest(BaseModel):
    """
    Request payload for solving a captcha image.

    Fields:
    - image_url: URL of the captcha image to be solved
    """

    image_url: str


class HealthResponse(BaseModel):
    """
    Response model for health check endpoint.
    """

    status: str = Field(description="Health status: 'healthy' or 'unhealthy'")
    app_name: str = Field(description="Application name")
    version: str = Field(description="Application version")
