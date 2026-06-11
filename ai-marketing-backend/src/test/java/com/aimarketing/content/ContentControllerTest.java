package com.aimarketing.content;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.aimarketing.dto.GeneratedContentResponse;
import com.aimarketing.integration.AiContentResponse;
import com.aimarketing.service.ContentService;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ContentController.class)
@AutoConfigureMockMvc(addFilters = false)
class ContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContentService contentService;

    @Test
    void generateReturnsWrappedResponse() throws Exception {
        AiContentResponse aiResponse = AiContentResponse.builder()
                .platform("instagram")
                .variations(List.of(AiContentResponse.Variation.builder()
                        .content("Move more with FitTrack.")
                        .hashtags(List.of("#fitness"))
                        .cta("Download now.")
                        .score(80)
                        .build()))
                .build();

        when(contentService.generate(eq("founder@example.com"), any()))
                .thenReturn(new GeneratedContentResponse(
                        1L,
                        "instagram",
                        "FitTrack",
                        aiResponse,
                        Instant.parse("2026-06-08T00:00:00Z")
                ));

        mockMvc.perform(post("/api/content/generate")
                        .with(user("founder@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "productName": "FitTrack",
                                  "productDescription": "AI fitness app",
                                  "targetAudience": "College students",
                                  "platform": "instagram",
                                  "tone": "motivational",
                                  "goal": "increase app downloads",
                                  "keywords": ["fitness", "health"]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.aiContent.platform").value("instagram"));
    }
}
