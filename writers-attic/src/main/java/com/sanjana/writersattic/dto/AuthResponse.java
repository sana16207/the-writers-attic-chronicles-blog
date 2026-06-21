package com.sanjana.writersattic.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

    private String token;

    private Long id;

    private String name;

    private String email;

    private String role;

    public AuthResponse(
            String token,
            Long id,
            String name,
            String email,
            String role) {

        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}