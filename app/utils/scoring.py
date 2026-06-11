import re

from app.models.content import AIContentVariation, GenerateContentRequest, Platform


WORD_RE = re.compile(r"\b[\w'-]+\b")


def calculate_engagement_score(
    variation: AIContentVariation, request: GenerateContentRequest
) -> int:
    """Mock heuristic score for ranking generated marketing variations."""
    content = variation.content.strip()
    words = WORD_RE.findall(content.lower())
    word_count = len(words)

    score = 45
    score += _length_score(request.platform, word_count)
    score += _keyword_score(content, request.keywords)
    score += _cta_score(variation.cta)
    score += _hashtag_score(request.platform, variation.hashtags)
    score += _specificity_score(content, request.product_name)

    return max(0, min(100, score))


def _length_score(platform: Platform, word_count: int) -> int:
    ideal_ranges = {
        Platform.instagram: (12, 65),
        Platform.linkedin: (80, 220),
        Platform.email: (70, 180),
        Platform.google_ads: (10, 45),
        Platform.product_description: (45, 140),
    }
    low, high = ideal_ranges[platform]
    if low <= word_count <= high:
        return 18
    if word_count < low:
        return max(2, int(18 * word_count / low))
    overage = word_count - high
    return max(0, 18 - int(overage / 12))


def _keyword_score(content: str, keywords: list[str]) -> int:
    if not keywords:
        return 8
    lowered = content.lower()
    hits = sum(1 for keyword in keywords if keyword.lower() in lowered)
    return min(16, hits * 5)


def _cta_score(cta: str) -> int:
    cta_words = WORD_RE.findall(cta.lower())
    if 2 <= len(cta_words) <= 14:
        return 12
    if cta_words:
        return 6
    return 0


def _hashtag_score(platform: Platform, hashtags: list[str]) -> int:
    count = len(hashtags)
    if platform == Platform.instagram:
        return 9 if 4 <= count <= 8 else 4 if count else 0
    if platform == Platform.linkedin:
        return 6 if 2 <= count <= 5 else 3 if count else 0
    return 6 if count == 0 else 0


def _specificity_score(content: str, product_name: str) -> int:
    score = 4 if product_name.lower() in content.lower() else 0
    if any(char.isdigit() for char in content):
        score += 2
    if "you" in content.lower() or "your" in content.lower():
        score += 3
    return score
