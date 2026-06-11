package com.aimarketing.dto;

import java.time.Instant;

public record GeneratedContentHistoryItem(
        Long id,
        String platform,
        String productName,
        Instant createdAt
) {
}
