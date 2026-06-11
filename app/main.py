import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.exceptions import (
    AIServiceConfigurationError,
    AIServiceError,
    AIServiceNetworkError,
    AIServiceQuotaError,
    AIServiceResponseError,
    AIServiceSafetyError,
)
from app.core.logging import setup_logging
from app.routes import generation, health


settings = get_settings()
setup_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description=(
        "Content-generation-only AI microservice for an AI Marketing "
        "Content Generator SaaS."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(generation.router, prefix=settings.api_v1_prefix)


@app.exception_handler(AIServiceConfigurationError)
async def configuration_exception_handler(
    request: Request, exc: AIServiceConfigurationError
) -> JSONResponse:
    logger.warning("Configuration error on %s: %s", request.url.path, exc)
    return JSONResponse(status_code=503, content={"detail": str(exc)})


@app.exception_handler(AIServiceResponseError)
async def response_exception_handler(
    request: Request, exc: AIServiceResponseError
) -> JSONResponse:
    logger.warning("AI response validation error on %s: %s", request.url.path, exc)
    return JSONResponse(status_code=502, content={"detail": str(exc)})


@app.exception_handler(AIServiceQuotaError)
async def quota_exception_handler(
    request: Request, exc: AIServiceQuotaError
) -> JSONResponse:
    logger.warning("AI provider quota error on %s: %s", request.url.path, exc)
    return JSONResponse(status_code=429, content={"detail": str(exc)})


@app.exception_handler(AIServiceSafetyError)
async def safety_exception_handler(
    request: Request, exc: AIServiceSafetyError
) -> JSONResponse:
    logger.warning("AI provider safety block on %s: %s", request.url.path, exc)
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(AIServiceNetworkError)
async def network_exception_handler(
    request: Request, exc: AIServiceNetworkError
) -> JSONResponse:
    logger.exception("AI provider network error on %s", request.url.path)
    return JSONResponse(
        status_code=502,
        content={"detail": "AI provider is temporarily unavailable."},
    )


@app.exception_handler(AIServiceError)
async def ai_service_exception_handler(
    request: Request, exc: AIServiceError
) -> JSONResponse:
    logger.exception("AI service error on %s", request.url.path)
    return JSONResponse(
        status_code=502,
        content={"detail": "Content generation provider is temporarily unavailable."},
    )
