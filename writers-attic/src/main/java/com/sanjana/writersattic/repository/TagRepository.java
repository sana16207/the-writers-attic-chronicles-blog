package com.sanjana.writersattic.repository;

import com.sanjana.writersattic.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository
        extends JpaRepository<Tag, Long> {
}