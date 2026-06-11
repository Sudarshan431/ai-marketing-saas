from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import get_settings


router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    model: str


class ProviderHealthResponse(BaseModel):
    provider: str
    model: str
    configured: bool


@router.get("/health", response_model=HealthResponse, summary="Health check")
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.environment,
        model=settings.gemini_model,
    )


@router.get(
    "/health/provider",
    response_model=ProviderHealthResponse,
    summary="AI provider diagnostics",
)
async def provider_health_check() -> ProviderHealthResponse:
    settings = get_settings()
    return ProviderHealthResponse(
        provider="gemini",
        model=settings.gemini_model,
        configured=settings.gemini_api_key is not None,
    )
