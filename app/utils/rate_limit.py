import logging

from fastapi import Request


logger = logging.getLogger(__name__)


async def rate_limit_dependency(request: Request) -> None:
    """Placeholder for Redis or gateway-backed rate limiting."""
    logger.debug("Rate-limit placeholder passed for client=%s", request.client.host if request.client else "unknown")
