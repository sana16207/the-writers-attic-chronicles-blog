package com.sanjana.writersattic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sanjana.writersattic.model.Story;

public interface StoryRepository extends JpaRepository<Story, Long> {

    @EntityGraph(attributePaths = {"author"})
    List<Story> findAll();

    @EntityGraph(attributePaths = {"author"})
    Optional<Story> findById(Long id);
}