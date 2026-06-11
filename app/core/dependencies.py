from functools import lru_cache

from app.core.config import Settings, get_settings
from app.models.content import MARKETING_CONTENT_JSON_SCHEMA
from app.services.ai_provider import AIProvider
from app.services.content_generation import ContentGenerationService
from app.services.gemini_provider import GeminiProvider
from app.utils.prompt_builder import PromptBuilder


@lru_cache
def get_prompt_builder() -> PromptBuilder:
    return PromptBuilder()


@lru_cache
def get_ai_provider() -> AIProvider:
    settings: Settings = get_settings()
    return GeminiProvider(
        settings=settings,
        response_schema=MARKETING_CONTENT_JSON_SCHEMA,
    )


@lru_cache
def get_content_generation_service() -> ContentGenerationService:
    return ContentGenerationService(
        prompt_builder=get_prompt_builder(),
        ai_provider=get_ai_provider(),
    )
