from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Platform(str, Enum):
    instagram = "instagram"
    linkedin = "linkedin"
    email = "email"
    google_ads = "google_ads"
    product_description = "product_description"


PLATFORM_ALIASES = {
    "instagram_caption": Platform.instagram,
    "instagram_captions": Platform.instagram,
    "linkedin_post": Platform.linkedin,
    "linkedin_posts": Platform.linkedin,
    "email_campaign": Platform.email,
    "email_campaigns": Platform.email,
    "google_ad": Platform.google_ads,
    "google_ads": Platform.google_ads,
    "googleads": Platform.google_ads,
    "product": Platform.product_description,
    "product_descriptions": Platform.product_description,
}


class GenerateContentRequest(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "product_name": "Nimbus CRM",
                    "product_description": (
                        "A lightweight CRM that helps founders manage leads, "
                        "follow-ups, and customer notes from one clean dashboard."
                    ),
                    "target_audience": "early-stage SaaS founders",
                    "platform": "linkedin",
                    "tone": "professional and confident",
                    "goal": "drive demo bookings",
                    "keywords": ["CRM", "sales pipeline", "founders"],
                }
            ]
        }
    )

    product_name: str = Field(..., min_length=2, max_length=120)
    product_description: str = Field(..., min_length=10, max_length=2500)
    target_audience: str = Field(..., min_length=2, max_length=250)
    platform: Platform
    tone: str = Field(..., min_length=2, max_length=80)
    goal: str = Field(..., min_length=2, max_length=250)
    keywords: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("platform", mode="before")
    @classmethod
    def normalize_platform(cls, value: Any) -> Platform:
        if isinstance(value, Platform):
            return value
        if not isinstance(value, str):
            raise ValueError("platform must be a string")

        normalized = value.strip().lower().replace("-", "_").replace(" ", "_")
        if normalized in PLATFORM_ALIASES:
            return PLATFORM_ALIASES[normalized]

        try:
            return Platform(normalized)
        except ValueError as exc:
            supported = ", ".join(platform.value for platform in Platform)
            raise ValueError(f"platform must be one of: {supported}") from exc

    @field_validator(
        "product_name",
        "product_description",
        "target_audience",
        "tone",
        "goal",
        mode="before",
    )
    @classmethod
    def strip_text(cls, value: Any) -> Any:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("keywords", mode="before")
    @classmethod
    def normalize_keywords(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            value = [keyword.strip() for keyword in value.split(",")]
        if not isinstance(value, list):
            raise ValueError("keywords must be a list of strings or a comma-separated string")

        seen: set[str] = set()
        cleaned_keywords: list[str] = []
        for item in value:
            keyword = str(item).strip()
            lookup_key = keyword.lower()
            if keyword and lookup_key not in seen:
                seen.add(lookup_key)
                cleaned_keywords.append(keyword)
        return cleaned_keywords


class AIContentVariation(BaseModel):
    content: str = Field(..., min_length=10, max_length=4000)
    hashtags: list[str] = Field(default_factory=list, max_length=12)
    cta: str = Field(..., min_length=2, max_length=280)


class AIGeneratedContentResponse(BaseModel):
    platform: Platform
    variations: list[AIContentVariation] = Field(..., min_length=3, max_length=3)


class ContentVariation(AIContentVariation):
    score: int = Field(..., ge=0, le=100)


class GenerateContentResponse(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "platform": "instagram",
                    "variations": [
                        {
                            "content": "Turn scattered lead notes into clear next steps.",
                            "hashtags": ["#CRM", "#SaaS", "#FounderLife"],
                            "cta": "Try Nimbus CRM today.",
                            "score": 82,
                        },
                        {
                            "content": "Your next customer conversation should never get lost.",
                            "hashtags": ["#SalesPipeline", "#StartupTools"],
                            "cta": "Book a product demo.",
                            "score": 79,
                        },
                        {
                            "content": "A cleaner pipeline for founders who move fast.",
                            "hashtags": ["#Founders", "#CRM"],
                            "cta": "See Nimbus CRM in action.",
                            "score": 84,
                        }
                    ],
                }
            ]
        }
    )

    platform: Platform
    variations: list[ContentVariation] = Field(..., min_length=3, max_length=3)


MARKETING_CONTENT_JSON_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "platform": {
            "type": "string",
            "enum": [platform.value for platform in Platform],
        },
        "variations": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "Generated marketing copy for this variation.",
                    },
                    "hashtags": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Relevant hashtags, or an empty array when not applicable.",
                    },
                    "cta": {
                        "type": "string",
                        "description": "A concise call-to-action suggestion.",
                    },
                },
                "required": ["content", "hashtags", "cta"],
            },
        },
    },
    "required": ["platform", "variations"],
}
