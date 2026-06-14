package com.sanjana.writersattic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sanjana.writersattic.model.Category;

public interface CategoryRepository
        extends JpaRepository<Category, Long> {
}