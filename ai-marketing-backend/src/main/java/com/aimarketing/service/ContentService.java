package com.aimarketing.service;

import com.aimarketing.dto.ContentGenerateRequest;
import com.aimarketing.dto.GeneratedContentHistoryItem;
import com.aimarketing.dto.GeneratedContentResponse;
import com.aimarketing.entity.GeneratedContent;
import com.aimarketing.entity.User;
import com.aimarketing.exception.AiServiceException;
import com.aimarketing.exception.ContentNotFoundException;
import com.aimarketing.integration.AiContentClient;
import com.aimarketing.integration.AiContentRequest;
import com.aimarketing.integration.AiContentResponse;
import com.aimarketing.repository.GeneratedContentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final GeneratedContentRepository generatedContentRepository;
    private final AuthService authService;
    private final AiContentClient aiContentClient;
    private final ObjectMapper objectMapper;

    @Transactional
    public GeneratedContentResponse generate(String userEmail, ContentGenerateRequest request) {
        User user = authService.getUserByEmail(userEmail);
        AiContentRequest aiRequest = toAiRequest(request);
        AiContentResponse aiResponse = aiContentClient.generateContent(aiRequest);

        GeneratedContent savedContent = generatedContentRepository.save(GeneratedContent.builder()
                .user(user)
                .platform(request.platform())
                .productName(request.productName())
                .inputJson(toJson(request))
                .outputJson(toJson(aiResponse))
                .build());

        return toResponse(savedContent, aiResponse);
    }

    @Transactional(readOnly = true)
    public List<GeneratedContentHistoryItem> history(String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return generatedContentRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(content -> new GeneratedContentHistoryItem(
                        content.getId(),
                        content.getPlatform(),
                        content.getProductName(),
                        content.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public GeneratedContentResponse getById(String userEmail, Long id) {
        User user = authService.getUserByEmail(userEmail);
        GeneratedContent content = generatedContentRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ContentNotFoundException("Generated content not found."));
        return toResponse(content, fromJson(content.getOutputJson()));
    }

    @Transactional
    public void delete(String userEmail, Long id) {
        User user = authService.getUserByEmail(userEmail);
        GeneratedContent content = generatedContentRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ContentNotFoundException("Generated content not found."));
        generatedContentRepository.delete(content);
    }

    private AiContentRequest toAiRequest(ContentGenerateRequest request) {
        return AiContentRequest.builder()
                .productName(request.productName())
                .productDescription(request.productDescription())
                .targetAudience(request.targetAudience())
                .platform(request.platform())
                .tone(request.tone())
                .goal(request.goal())
                .keywords(request.keywords() == null ? List.of() : request.keywords())
                .build();
    }

    private GeneratedContentResponse toResponse(GeneratedContent content, AiContentResponse aiResponse) {
        return new GeneratedContentResponse(
                content.getId(),
                content.getPlatform(),
                content.getProductName(),
                aiResponse,
                content.getCreatedAt()
        );
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new AiServiceException("Failed to serialize generated content.", ex);
        }
    }

    private AiContentResponse fromJson(String value) {
        try {
            return objectMapper.readValue(value, AiContentResponse.class);
        } catch (JsonProcessingException ex) {
            throw new AiServiceException("Failed to deserialize generated content.", ex);
        }
    }
}
