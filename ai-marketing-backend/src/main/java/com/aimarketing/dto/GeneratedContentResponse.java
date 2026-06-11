package com.aimarketing.dto;

import com.aimarketing.integration.AiContentResponse;
import java.time.Instant;

public record GeneratedContentResponse(
        Long id,
        String platform,
        String productName,
        AiContentResponse aiContent,
        Instant createdAt
) {
}
