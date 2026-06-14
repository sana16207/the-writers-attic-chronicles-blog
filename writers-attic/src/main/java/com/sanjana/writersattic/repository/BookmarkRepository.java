package com.sanjana.writersattic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sanjana.writersattic.model.Bookmark;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.model.User;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByStoryAndUser(Story story, User user);

    List<Bookmark> findByUser(User user);

    @Modifying
    @Transactional
    void deleteByStoryAndUser(Story story, User user);
}