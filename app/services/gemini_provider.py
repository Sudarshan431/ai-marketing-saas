import json
import logging
from collections.abc import AsyncIterator
from typing import Any

from google import genai
from google.genai import errors, types

from app.core.config import Settings
from app.core.exceptions import (
    AIServiceConfigurationError,
    AIServiceError,
    AIServiceNetworkError,
    AIServiceQuotaError,
    AIServiceResponseError,
    AIServiceSafetyError,
)
from app.services.ai_provider import AIProvider


logger = logging.getLogger(__name__)


class GeminiProvider(AIProvider):
    """Google Gemini implementation using the google-genai SDK."""

    def __init__(self, settings: Settings, response_schema: dict[str, Any]) -> None:
        self._settings = settings
        self._response_schema = response_schema
        self._client: Any | None = None

    @property
    def client(self) -> Any:
        if self._client is None:
            if self._settings.gemini_api_key is None:
                raise AIServiceConfigurationError(
                    "GEMINI_API_KEY is not configured. Add it to .env or the environment."
                )
            self._client = genai.Client(
                api_key=self._settings.gemini_api_key.get_secret_value(),
                http_options=types.HttpOptions(
                    client_args={"timeout": self._settings.gemini_timeout_seconds},
                    async_client_args={"timeout": self._settings.gemini_timeout_seconds},
                ),
            ).aio
        return self._client

    async def generate(self, prompt: str) -> dict[str, Any]:
        try:
            return await self._generate_structured(prompt)
        except AIServiceResponseError:
            raise
        except errors.APIError as exc:
            if self._can_fallback_to_json_text(exc):
                logger.warning(
                    "Gemini structured output rejected; falling back to JSON text mode"
                )
                return await self._generate_json_text(prompt)
            raise self._map_api_error(exc) from exc
        except AIServiceError:
            raise
        except (TimeoutError, OSError) as exc:
            raise AIServiceNetworkError("Network failure while calling Gemini.") from exc
        except Exception as exc:
            if self._looks_like_network_error(exc):
                raise AIServiceNetworkError("Network failure while calling Gemini.") from exc
            raise AIServiceError("Gemini generation failed.") from exc

    async def stream(self, prompt: str) -> AsyncIterator[str]:
        try:
            stream = await self.client.models.generate_content_stream(
                model=self._settings.gemini_model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    max_output_tokens=self._settings.gemini_max_output_tokens,
                ),
            )
            async for chunk in stream:
                if getattr(chunk, "text", None):
                    yield chunk.text
                elif hasattr(chunk, "model_dump_json"):
                    yield chunk.model_dump_json()
                else:
                    yield json.dumps(chunk)
        except errors.APIError as exc:
            raise self._map_api_error(exc) from exc

    async def _generate_structured(self, prompt: str) -> dict[str, Any]:
        response = await self.client.models.generate_content(
            model=self._settings.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=self._settings.gemini_max_output_tokens,
                response_mime_type="application/json",
                response_json_schema=self._response_schema,
            ),
        )
        self._raise_for_safety_block(response)
        return self._parse_json_text(self._extract_text(response))

    async def _generate_json_text(self, prompt: str) -> dict[str, Any]:
        fallback_prompt = (
            f"{prompt}\n\n"
            "Return only valid JSON. Do not wrap the JSON in markdown fences. "
            "The JSON must include platform and exactly 3 variations, where each "
            "variation includes content, hashtags, and cta."
        )
        response = await self.client.models.generate_content(
            model=self._settings.gemini_model,
            contents=fallback_prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=self._settings.gemini_max_output_tokens,
                response_mime_type="application/json",
            ),
        )
        self._raise_for_safety_block(response)
        return self._parse_json_text(self._extract_text(response))

    def _extract_text(self, response: Any) -> str:
        text = getattr(response, "text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()

        parts: list[str] = []
        for candidate in getattr(response, "candidates", []) or []:
            content = getattr(candidate, "content", None)
            for part in getattr(content, "parts", []) or []:
                part_text = getattr(part, "text", None)
                if isinstance(part_text, str):
                    parts.append(part_text)

        combined_text = "".join(parts).strip()
        if combined_text:
            return combined_text

        self._raise_for_safety_block(response)
        raise AIServiceResponseError("Gemini response did not include text output.")

    def _parse_json_text(self, raw_text: str) -> dict[str, Any]:
        cleaned_text = self._strip_json_fence(raw_text)
        try:
            payload = json.loads(cleaned_text)
        except json.JSONDecodeError as exc:
            logger.warning("Gemini response was malformed JSON: %s", cleaned_text[:300])
            raise AIServiceResponseError("Gemini response was not valid JSON.") from exc

        if not isinstance(payload, dict):
            raise AIServiceResponseError("Gemini response JSON must be an object.")
        return payload

    def _strip_json_fence(self, raw_text: str) -> str:
        text = raw_text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines and lines[0].strip().startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text

    def _raise_for_safety_block(self, response: Any) -> None:
        prompt_feedback = getattr(response, "prompt_feedback", None)
        block_reason = getattr(prompt_feedback, "block_reason", None)
        if block_reason:
            raise AIServiceSafetyError(f"Gemini blocked the prompt for safety: {block_reason}.")

        for candidate in getattr(response, "candidates", []) or []:
            finish_reason = str(getattr(candidate, "finish_reason", "")).upper()
            if "SAFETY" in finish_reason or "PROHIBITED" in finish_reason:
                raise AIServiceSafetyError("Gemini blocked the response for safety.")

    def _map_api_error(self, exc: errors.APIError) -> AIServiceError:
        code = int(getattr(exc, "code", 0) or 0)
        message = str(getattr(exc, "message", str(exc)))
        normalized_message = message.lower()

        if code in {400, 401, 403} and (
            "api key" in normalized_message
            or "permission" in normalized_message
            or "unauthorized" in normalized_message
            or "forbidden" in normalized_message
        ):
            return AIServiceConfigurationError(
                "Gemini API key is invalid or not authorized for this project."
            )

        if code == 429 or "resource_exhausted" in normalized_message or "quota" in normalized_message:
            return AIServiceQuotaError("Gemini quota or rate limit was exceeded.")

        if "safety" in normalized_message or "blocked" in normalized_message:
            return AIServiceSafetyError("Gemini blocked the request for safety.")

        if code >= 500 or code in {408, 409, 503, 504}:
            return AIServiceNetworkError("Gemini service is temporarily unavailable.")

        return AIServiceError(f"Gemini API error: {message}")

    def _can_fallback_to_json_text(self, exc: errors.APIError) -> bool:
        code = int(getattr(exc, "code", 0) or 0)
        message = str(getattr(exc, "message", str(exc))).lower()
        return code == 400 and (
            "schema" in message
            or "response_mime_type" in message
            or "response_json_schema" in message
            or "response format" in message
        )

    def _looks_like_network_error(self, exc: Exception) -> bool:
        name = exc.__class__.__name__.lower()
        message = str(exc).lower()
        indicators = ("timeout", "network", "connect", "connection", "temporarily unavailable")
        return any(indicator in name or indicator in message for indicator in indicators)
