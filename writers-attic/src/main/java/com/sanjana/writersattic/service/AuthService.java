package com.sanjana.writersattic.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sanjana.writersattic.dto.AuthResponse;
import com.sanjana.writersattic.dto.LoginRequest;
import com.sanjana.writersattic.dto.RegisterRequest;
import com.sanjana.writersattic.model.User;
import com.sanjana.writersattic.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {

        System.out.println("========== REGISTER START ==========");

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );
        user.setRole("USER");
        userRepository.save(user);

        System.out.println("User saved successfully");
        System.out.println("========== REGISTER END ==========");

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

    boolean passwordMatches =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword());

    if (!passwordMatches) {
        throw new RuntimeException("Invalid password");
    }

    String token =
            jwtService.generateToken(user.getEmail());

    return new AuthResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
    );
}
}