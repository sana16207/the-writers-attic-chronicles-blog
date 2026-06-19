package com.sanjana.writersattic.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sanjana.writersattic.model.User;
import com.sanjana.writersattic.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User admin = userRepository
                .findByEmail(email)
                .orElseThrow();

        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException(
                    "Access denied");
        }

        userRepository.deleteById(id);

        return "User deleted";
    }
}