class AIServiceError(Exception):
    """Base exception for content generation failures."""


class AIServiceConfigurationError(AIServiceError):
    """Raised when the AI provider is not configured correctly."""


class AIServiceNetworkError(AIServiceError):
    """Raised when the AI provider cannot be reached reliably."""


class AIServiceQuotaError(AIServiceError):
    """Raised when the AI provider quota or rate limit is exceeded."""


class AIServiceResponseError(AIServiceError):
    """Raised when the AI response cannot be validated."""


class AIServiceSafetyError(AIServiceError):
    """Raised when the AI provider blocks content for safety reasons."""
