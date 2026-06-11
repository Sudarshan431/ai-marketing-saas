package com.aimarketing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ContentGenerateRequest(
        @NotBlank @Size(min = 2, max = 120) String productName,
        @NotBlank @Size(min = 2, max = 2500) String productDescription,
        @NotBlank @Size(min = 2, max = 250) String targetAudience,
        @NotBlank @Size(min = 2, max = 60) String platform,
        @NotBlank @Size(min = 2, max = 80) String tone,
        @NotBlank @Size(min = 2, max = 250) String goal,
        @Size(max = 20) List<@Size(max = 60) String> keywords
) {
}
