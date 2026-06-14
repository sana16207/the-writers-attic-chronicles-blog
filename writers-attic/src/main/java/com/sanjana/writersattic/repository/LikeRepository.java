package com.sanjana.writersattic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.sanjana.writersattic.model.Like;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.model.User;

public interface LikeRepository extends JpaRepository<Like, Long> {

    long countByStory(Story story);

    boolean existsByStoryAndUser(Story story, User user);

    @Transactional
    void deleteByStoryAndUser(Story story, User user);
}