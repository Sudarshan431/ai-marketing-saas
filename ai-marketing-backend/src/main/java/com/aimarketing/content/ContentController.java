package com.aimarketing.content;

import com.aimarketing.common.ApiResponse;
import com.aimarketing.dto.ContentGenerateRequest;
import com.aimarketing.dto.GeneratedContentHistoryItem;
import com.aimarketing.dto.GeneratedContentResponse;
import com.aimarketing.service.ContentService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @PostMapping("/generate")
    public ApiResponse<GeneratedContentResponse> generate(
            Authentication authentication,
            @Valid @RequestBody ContentGenerateRequest request
    ) {
        return ApiResponse.success(
                "Content generated successfully.",
                contentService.generate(authentication.getName(), request)
        );
    }

    @GetMapping("/history")
    public ApiResponse<List<GeneratedContentHistoryItem>> history(Authentication authentication) {
        return ApiResponse.success(
                "Content history loaded.",
                contentService.history(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<GeneratedContentResponse> getById(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ApiResponse.success(
                "Generated content loaded.",
                contentService.getById(authentication.getName(), id)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(Authentication authentication, @PathVariable Long id) {
        contentService.delete(authentication.getName(), id);
        return ApiResponse.success("Generated content deleted.", null);
    }
}
