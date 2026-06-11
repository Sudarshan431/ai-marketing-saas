from app.models.content import GenerateContentRequest
from app.prompts.templates import PLATFORM_GUIDELINES, SYSTEM_PROMPT, USER_PROMPT_TEMPLATE


class PromptBuilder:
    def build_messages(self, request: GenerateContentRequest) -> list[dict[str, str]]:
        keywords = ", ".join(request.keywords) if request.keywords else "No required keywords"
        user_prompt = USER_PROMPT_TEMPLATE.format(
            product_name=request.product_name,
            product_description=request.product_description,
            target_audience=request.target_audience,
            platform=request.platform.value,
            tone=request.tone,
            goal=request.goal,
            keywords=keywords,
            platform_guidelines=PLATFORM_GUIDELINES[request.platform],
        )

        return [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ]

    def build_prompt(self, request: GenerateContentRequest) -> str:
        messages = self.build_messages(request)
        return "\n\n".join(
            f"{message['role'].upper()}:\n{message['content']}" for message in messages
        )
