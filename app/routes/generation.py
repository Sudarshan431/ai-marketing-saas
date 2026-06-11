import logging

from fastapi import APIRouter, Depends

from app.core.dependencies import get_content_generation_service
from app.models.content import GenerateContentRequest, GenerateContentResponse
from app.services.content_generation import ContentGenerationService
from app.utils.rate_limit import rate_limit_dependency


logger = logging.getLogger(__name__)

router = APIRouter(tags=["generation"])


@router.post(
    "/generate",
    response_model=GenerateContentResponse,
    dependencies=[Depends(rate_limit_dependency)],
    summary="Generate marketing content",
)
async def generate_content(
    request: GenerateContentRequest,
    service: ContentGenerationService = Depends(get_content_generation_service),
) -> GenerateContentResponse:
    logger.info("Generating content for platform=%s product=%s", request.platform, request.product_name)
    return await service.generate(request)
