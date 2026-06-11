package com.aimarketing.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.aimarketing.dto.LoginRequest;
import com.aimarketing.dto.RegisterRequest;
import com.aimarketing.entity.User;
import com.aimarketing.exception.InvalidCredentialsException;
import com.aimarketing.repository.UserRepository;
import com.aimarketing.security.JwtService;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registersUserWithEncodedPasswordAndJwt() {
        when(userRepository.existsByEmail("founder@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            user.setCreatedAt(Instant.now());
            return user;
        });
        when(jwtService.generateToken("founder@example.com")).thenReturn("jwt-token");

        var response = authService.register(new RegisterRequest(
                "Founder",
                "Founder@Example.com",
                "password123"
        ));

        assertThat(response.token()).isEqualTo("jwt-token");
        assertThat(response.user().email()).isEqualTo("founder@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void rejectsInvalidPassword() {
        User user = User.builder()
                .id(1L)
                .name("Founder")
                .email("founder@example.com")
                .password("encoded")
                .createdAt(Instant.now())
                .build();

        when(userRepository.findByEmail("founder@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("founder@example.com", "wrong")))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
