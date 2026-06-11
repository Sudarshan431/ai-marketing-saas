package com.aimarketing.repository;

import com.aimarketing.entity.GeneratedContent;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneratedContentRepository extends JpaRepository<GeneratedContent, Long> {

    List<GeneratedContent> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<GeneratedContent> findByIdAndUserId(Long id, Long userId);
}
