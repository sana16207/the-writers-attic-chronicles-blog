package com.sanjana.writersattic.repository;


import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.sanjana.writersattic.model.Story;
public interface StoryRepository extends JpaRepository<Story, Long> {

    @EntityGraph(attributePaths = {"author"})
    Page<Story> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"author"})
   Page<Story> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
    String title,
    String content,
    Pageable pageable
);
}