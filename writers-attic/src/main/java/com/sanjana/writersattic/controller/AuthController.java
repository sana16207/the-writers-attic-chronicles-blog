package com.sanjana.writersattic.controller;

import com.sanjana.writersattic.dto.AuthResponse;
import com.sanjana.writersattic.dto.LoginRequest;
import com.sanjana.writersattic.dto.RegisterRequest;
import com.sanjana.writersattic.service.AuthService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {

        String message = authService.register(request);

        return new AuthResponse(message);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        return new AuthResponse(token);
    }
}