package com.aimarketing.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.aimarketing.entity.GeneratedContent;
import com.aimarketing.entity.User;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class GeneratedContentRepositoryTest {

    @Autowired
    private GeneratedContentRepository generatedContentRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void returnsOnlyContentForRequestedUser() {
        User owner = userRepository.save(user("owner@example.com"));
        User other = userRepository.save(user("other@example.com"));

        GeneratedContent ownerContent = generatedContentRepository.save(content(owner, "FitTrack"));
        generatedContentRepository.save(content(other, "Other Product"));

        List<GeneratedContent> history = generatedContentRepository.findByUserIdOrderByCreatedAtDesc(owner.getId());

        assertThat(history).hasSize(1);
        assertThat(history.getFirst().getId()).isEqualTo(ownerContent.getId());
        assertThat(generatedContentRepository.findByIdAndUserId(ownerContent.getId(), owner.getId())).isPresent();
        assertThat(generatedContentRepository.findByIdAndUserId(ownerContent.getId(), other.getId())).isEmpty();
    }

    private User user(String email) {
        return User.builder()
                .name("Test User")
                .email(email)
                .password("encoded-password")
                .build();
    }

    private GeneratedContent content(User user, String productName) {
        return GeneratedContent.builder()
                .user(user)
                .platform("instagram")
                .productName(productName)
                .inputJson("{}")
                .outputJson("{\"platform\":\"instagram\",\"variations\":[]}")
                .build();
    }
}
