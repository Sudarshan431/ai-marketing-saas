package com.aimarketing.dto;

public record AuthResponse(
        String token,
        CurrentUserResponse user
) {
}
