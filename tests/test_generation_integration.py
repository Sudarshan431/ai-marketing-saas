from collections.abc import AsyncIterator
from typing import Any

from fastapi.testclient import TestClient

from app.core.dependencies import get_content_generation_service
from app.core.exceptions import AIServiceQuotaError
from app.main import app
from app.services.ai_provider import AIProvider
from app.services.content_generation import ContentGenerationService
from app.utils.prompt_builder import PromptBuilder


REQUEST_PAYLOAD = {
    "product_name": "Nimbus CRM",
    "product_description": (
        "A lightweight CRM that helps founders manage leads, follow-ups, "
        "and customer notes from one clean dashboard."
    ),
    "target_audience": "early-stage SaaS founders",
    "platform": "linkedin",
    "tone": "professional and confident",
    "goal": "drive demo bookings",
    "keywords": ["CRM", "sales pipeline", "founders"],
}


VALID_PROVIDER_PAYLOAD = {
    "platform": "linkedin",
    "variations": [
        {
            "content": (
                "Nimbus CRM helps founders turn scattered lead notes into a "
                "clear sales pipeline, so every follow-up has a next step."
            ),
            "hashtags": ["#CRM", "#SaaS", "#Founders"],
            "cta": "Book a demo today.",
        },
        {
            "content": (
                "For founders who need cleaner customer context, Nimbus CRM "
                "keeps leads, notes, and follow-ups together without slowing "
                "the team down."
            ),
            "hashtags": ["#SalesPipeline", "#StartupTools"],
            "cta": "See Nimbus CRM in action.",
        },
        {
            "content": (
                "Your next customer conversation should not disappear in a "
                "spreadsheet. Nimbus CRM gives founders one focused place to "
                "manage the pipeline."
            ),
            "hashtags": ["#FounderLife", "#CRM"],
            "cta": "Start organizing your pipeline.",
        },
    ],
}


class FakeProvider(AIProvider):
    def __init__(self, result: dict[str, Any] | Exception) -> None:
        self.result = result

    async def generate(self, prompt: str) -> dict[str, Any]:
        if isinstance(self.result, Exception):
            raise self.result
        return self.result

    async def stream(self, prompt: str) -> AsyncIterator[str]:
        yield "{}"


def build_service(result: dict[str, Any] | Exception) -> ContentGenerationService:
    service = ContentGenerationService(
        prompt_builder=PromptBuilder(),
        ai_provider=FakeProvider(result),
    )
    service._settings.gemini_max_retries = 1
    return service


def test_generate_content_success() -> None:
    app.dependency_overrides[get_content_generation_service] = lambda: build_service(
        VALID_PROVIDER_PAYLOAD
    )

    with TestClient(app) as client:
        response = client.post("/api/v1/generate", json=REQUEST_PAYLOAD)

    app.dependency_overrides.clear()

    assert response.status_code == 200
    body = response.json()
    assert body["platform"] == "linkedin"
    assert len(body["variations"]) == 3
    assert all(isinstance(variation["score"], int) for variation in body["variations"])
    assert all(0 <= variation["score"] <= 100 for variation in body["variations"])


def test_generate_content_rejects_invalid_schema() -> None:
    invalid_payload = {"platform": "linkedin", "variations": []}
    app.dependency_overrides[get_content_generation_service] = lambda: build_service(
        invalid_payload
    )

    with TestClient(app) as client:
        response = client.post("/api/v1/generate", json=REQUEST_PAYLOAD)

    app.dependency_overrides.clear()

    assert response.status_code == 502
    assert response.json()["detail"] == "AI response did not match the expected schema."


def test_generate_content_maps_provider_quota_errors() -> None:
    app.dependency_overrides[get_content_generation_service] = lambda: build_service(
        AIServiceQuotaError("Gemini quota or rate limit was exceeded.")
    )

    with TestClient(app) as client:
        response = client.post("/api/v1/generate", json=REQUEST_PAYLOAD)

    app.dependency_overrides.clear()

    assert response.status_code == 429
    assert response.json()["detail"] == "Gemini quota or rate limit was exceeded."
