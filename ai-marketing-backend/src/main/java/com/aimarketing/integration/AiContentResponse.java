package com.aimarketing.integration;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiContentResponse {

    private String platform;
    @Builder.Default
    private List<Variation> variations = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Variation {
        private String content;
        @Builder.Default
        private List<String> hashtags = new ArrayList<>();
        private String cta;
        private Integer score;
    }
}
