import logging
from collections.abc import AsyncIterator

from pydantic import ValidationError
from tenacity import AsyncRetrying, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.core.exceptions import (
    AIServiceError,
    AIServiceNetworkError,
    AIServiceResponseError,
)
from app.models.content import (
    AIGeneratedContentResponse,
    ContentVariation,
    GenerateContentRequest,
    GenerateContentResponse,
    Platform,
)
from app.services.ai_provider import AIProvider
from app.utils.prompt_builder import PromptBuilder
from app.utils.scoring import calculate_engagement_score


logger = logging.getLogger(__name__)


class ContentGenerationService:
    """Coordinates prompt construction, provider calls, validation, and scoring."""

    def __init__(self, prompt_builder: PromptBuilder, ai_provider: AIProvider) -> None:
        self._prompt_builder = prompt_builder
        self._ai_provider = ai_provider
        self._settings = get_settings()

    async def generate(self, request: GenerateContentRequest) -> GenerateContentResponse:
        ai_response = await self._request_ai_content(request)
        variations = [
            ContentVariation(
                content=variation.content,
                hashtags=self._clean_hashtags(request.platform, variation.hashtags),
                cta=variation.cta,
                score=calculate_engagement_score(variation, request),
            )
            for variation in ai_response.variations
        ]
        return GenerateContentResponse(platform=request.platform, variations=variations)

    async def _request_ai_content(
        self, request: GenerateContentRequest
    ) -> AIGeneratedContentResponse:
        prompt = self._prompt_builder.build_prompt(request)

        async for attempt in AsyncRetrying(
            stop=stop_after_attempt(self._settings.gemini_max_retries),
            wait=wait_exponential(multiplier=0.8, min=0.8, max=6),
            retry=retry_if_exception_type((AIServiceNetworkError, AIServiceResponseError)),
            reraise=True,
        ):
            with attempt:
                logger.debug(
                    "Calling AI provider model=%s attempt=%s",
                    self._settings.gemini_model,
                    attempt.retry_state.attempt_number,
                )
                payload = await self._ai_provider.generate(prompt)
                parsed_response = self._validate_provider_payload(payload)
                if parsed_response.platform != request.platform:
                    raise AIServiceResponseError(
                        "AI response platform did not match the requested platform."
                    )
                return parsed_response

        raise AIServiceError("Content generation retry loop exited unexpectedly.")

    def _validate_provider_payload(
        self, payload: dict[str, object]
    ) -> AIGeneratedContentResponse:
        try:
            return AIGeneratedContentResponse.model_validate(payload)
        except ValidationError as exc:
            logger.warning("AI provider response failed validation: %s", exc)
            raise AIServiceResponseError("AI response did not match the expected schema.") from exc

    def _clean_hashtags(self, platform: Platform, hashtags: list[str]) -> list[str]:
        if platform not in {Platform.instagram, Platform.linkedin}:
            return []

        cleaned: list[str] = []
        seen: set[str] = set()
        for hashtag in hashtags:
            normalized = hashtag.strip()
            if not normalized:
                continue
            if not normalized.startswith("#"):
                normalized = f"#{normalized}"
            lookup_key = normalized.lower()
            if lookup_key not in seen:
                seen.add(lookup_key)
                cleaned.append(normalized)
        return cleaned[:8]

    async def stream_generation_events(
        self, request: GenerateContentRequest
    ) -> AsyncIterator[str]:
        """Prepared extension point for future server-sent streaming routes."""
        prompt = self._prompt_builder.build_prompt(request)
        async for event in self._ai_provider.stream(prompt):
            yield event
