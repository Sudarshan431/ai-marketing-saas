package com.aimarketing.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.aimarketing.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.flyway.enabled=false",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findsUserByEmail() {
        User saved = userRepository.save(User.builder()
                .name("Sudarshan")
                .email("sudarshan@example.com")
                .password("encoded-password")
                .build());

        assertThat(userRepository.findByEmail("sudarshan@example.com"))
                .isPresent()
                .get()
                .extracting(User::getId)
                .isEqualTo(saved.getId());
        assertThat(userRepository.existsByEmail("sudarshan@example.com")).isTrue();
    }
}
