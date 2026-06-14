package com.sanjana.writersattic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sanjana.writersattic.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
}