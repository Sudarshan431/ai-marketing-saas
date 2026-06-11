package com.aimarketing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aimarketing.dto.ContentGenerateRequest;
import com.aimarketing.entity.GeneratedContent;
import com.aimarketing.entity.User;
import com.aimarketing.integration.AiContentClient;
import com.aimarketing.integration.AiContentResponse;
import com.aimarketing.repository.GeneratedContentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ContentServiceTest {

    @Mock
    private GeneratedContentRepository generatedContentRepository;

    @Mock
    private AuthService authService;

    @Mock
    private AiContentClient aiContentClient;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ContentService contentService;

    @Test
    void generatesContentViaFastApiClientAndStoresHistory() {
        User user = User.builder()
                .id(10L)
                .name("Founder")
                .email("founder@example.com")
                .password("encoded")
                .createdAt(Instant.now())
                .build();

        AiContentResponse aiResponse = AiContentResponse.builder()
                .platform("instagram")
                .variations(List.of(AiContentResponse.Variation.builder()
                        .content("Move more with FitTrack.")
                        .hashtags(List.of("#fitness", "#health"))
                        .cta("Download FitTrack today.")
                        .score(82)
                        .build()))
                .build();

        when(authService.getUserByEmail("founder@example.com")).thenReturn(user);
        when(aiContentClient.generateContent(any())).thenReturn(aiResponse);
        when(generatedContentRepository.save(any(GeneratedContent.class))).thenAnswer(invocation -> {
            GeneratedContent content = invocation.getArgument(0);
            content.setId(99L);
            content.setCreatedAt(Instant.now());
            return content;
        });

        var response = contentService.generate("founder@example.com", request());

        assertThat(response.id()).isEqualTo(99L);
        assertThat(response.aiContent().getPlatform()).isEqualTo("instagram");
        verify(aiContentClient).generateContent(any());
        verify(generatedContentRepository).save(any(GeneratedContent.class));
    }

    private ContentGenerateRequest request() {
        return new ContentGenerateRequest(
                "FitTrack",
                "AI fitness app",
                "College students",
                "instagram",
                "motivational",
                "increase app downloads",
                List.of("fitness", "health")
        );
    }
}
