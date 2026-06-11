package com.aimarketing.service;

import com.aimarketing.dto.AuthResponse;
import com.aimarketing.dto.CurrentUserResponse;
import com.aimarketing.dto.LoginRequest;
import com.aimarketing.dto.RegisterRequest;
import com.aimarketing.entity.User;
import com.aimarketing.exception.DuplicateEmailException;
import com.aimarketing.exception.InvalidCredentialsException;
import com.aimarketing.exception.UserNotFoundException;
import com.aimarketing.repository.UserRepository;
import com.aimarketing.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email is already registered.");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .build();

        User savedUser = userRepository.save(user);
        return new AuthResponse(jwtService.generateToken(savedUser.getEmail()), toCurrentUser(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        return new AuthResponse(jwtService.generateToken(user.getEmail()), toCurrentUser(user));
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse currentUser(String email) {
        User user = getUserByEmail(email);
        return toCurrentUser(user);
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new UserNotFoundException("User not found."));
    }

    private CurrentUserResponse toCurrentUser(User user) {
        return new CurrentUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
