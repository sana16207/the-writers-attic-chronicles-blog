package com.sanjana.writersattic.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        userRepository.save(user);

        System.out.println("User saved successfully");
        System.out.println("========== REGISTER END ==========");

        return "User registered successfully";
    }

    public String login(LoginRequest request) {

        System.out.println("========== LOGIN START ==========");
        System.out.println("STEP 1 : Request Received");
        System.out.println("Email = " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("STEP 2 : User Found");
        System.out.println("DB Email = " + user.getEmail());

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword());

        System.out.println("STEP 3 : Password Match = " + passwordMatches);

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        System.out.println("STEP 4 : Generating JWT");

        String token = jwtService.generateToken(user.getEmail());

        System.out.println("STEP 5 : JWT Generated");
        System.out.println(token);

        System.out.println("========== LOGIN END ==========");

        return token;
    }
}