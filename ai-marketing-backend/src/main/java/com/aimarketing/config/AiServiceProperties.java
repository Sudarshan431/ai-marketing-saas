package com.aimarketing.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "ai-service")
public record AiServiceProperties(
        @NotBlank String baseUrl,
        @Min(1) int timeoutSeconds,
        @Min(0) int maxRetries
) {
}
