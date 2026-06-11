from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from typing import Any


class AIProvider(ABC):
    """Provider boundary for text-to-JSON generation backends."""

    @abstractmethod
    async def generate(self, prompt: str) -> dict[str, Any]:
        """Generate a validated JSON-compatible dictionary from a prompt."""

    @abstractmethod
    async def stream(self, prompt: str) -> AsyncIterator[str]:
        """Yield provider streaming events for future API streaming support."""
