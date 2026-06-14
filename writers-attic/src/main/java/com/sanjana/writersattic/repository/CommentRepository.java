package com.sanjana.writersattic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sanjana.writersattic.model.Comment;

@Repository
public interface CommentRepository
        extends JpaRepository<Comment, Long> {

    List<Comment> findByStoryId(Long storyId);
}