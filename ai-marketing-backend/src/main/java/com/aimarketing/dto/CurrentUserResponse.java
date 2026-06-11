package com.aimarketing.dto;

import java.time.Instant;

public record CurrentUserResponse(
        Long id,
        String name,
        String email,
        Instant createdAt
) {
}
