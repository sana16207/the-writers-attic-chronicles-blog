package com.sanjana.writersattic.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.sanjana.writersattic.model.Bookmark;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.model.User;
import com.sanjana.writersattic.repository.BookmarkRepository;
import com.sanjana.writersattic.repository.StoryRepository;
import com.sanjana.writersattic.repository.UserRepository;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository,
                           StoryRepository storyRepository,
                           UserRepository userRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    public String bookmarkStory(Long storyId) {

    Story story = storyRepository.findById(storyId)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (bookmarkRepository.existsByStoryAndUser(story, user)) {
        return "Already bookmarked";
    }

    Bookmark bookmark = Bookmark.builder()
            .story(story)
            .user(user)
            .build();

    bookmarkRepository.save(bookmark);

    return "Story bookmarked";
}

    public String removeBookmark(Long storyId) {

    Story story = storyRepository.findById(storyId)
            .orElseThrow(() -> new RuntimeException("Story not found"));

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    bookmarkRepository.deleteByStoryAndUser(story, user);

    return "Bookmark removed";
}

    public List<Bookmark> getMyBookmarks() {

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return bookmarkRepository.findByUser(user);
}
}