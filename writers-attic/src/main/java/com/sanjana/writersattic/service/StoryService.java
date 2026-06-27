package com.sanjana.writersattic.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sanjana.writersattic.dto.ApiResponse;
import com.sanjana.writersattic.dto.StoryRequest;
import com.sanjana.writersattic.dto.StoryResponse;
import com.sanjana.writersattic.exception.StoryNotFoundException;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.model.User;
import com.sanjana.writersattic.repository.LikeRepository;
import com.sanjana.writersattic.repository.StoryRepository;
import com.sanjana.writersattic.repository.UserRepository;
import com.sanjana.writersattic.repository.BookmarkRepository;
@Service
public class StoryService {

    private final StoryRepository storyRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;

    public StoryService(
            StoryRepository storyRepository,
            LikeRepository likeRepository,
            UserRepository userRepository,
            BookmarkRepository bookmarkRepository) {

        this.storyRepository = storyRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.bookmarkRepository = bookmarkRepository;
    }

    // CREATE
    public ApiResponse<StoryResponse> createStory(StoryRequest request) {
        
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("EMAIL FROM SECURITY = " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Story story = Story.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .author(user)
                .build();

        Story saved = storyRepository.save(story);

        return ApiResponse.success("Story created", mapToResponse(saved));
    }

    // GET ALL (LATEST FIRST + PAGINATION)
    public ApiResponse<Page<StoryResponse>> getAllStories(Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<StoryResponse> page = storyRepository.findAll(sortedPageable)
                .map(this::mapToResponse);

        return ApiResponse.success("All stories", page);
    }

    // SEARCH
    public ApiResponse<Page<StoryResponse>> searchStories(String keyword, Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<StoryResponse> page = storyRepository
                .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
    keyword,
    keyword,
    sortedPageable
)
                .map(this::mapToResponse);

        return ApiResponse.success("Search results", page);
    }

    // GET BY ID
    public ApiResponse<StoryResponse> getStoryById(Long id) {

        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new StoryNotFoundException("Story not found"));

        return ApiResponse.success("Story found", mapToResponse(story));
    }

    // UPDATE
    public ApiResponse<StoryResponse> updateStory(Long id, StoryRequest request) {

        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new StoryNotFoundException("Story not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());

        boolean isOwner = story.getAuthor() != null &&
                story.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Not allowed to edit this story");
        }

        story.setTitle(request.getTitle());
        story.setContent(request.getContent());
        story.setStatus(request.getStatus());
        story.setUpdatedAt(LocalDateTime.now());

        Story updated = storyRepository.save(story);

        return ApiResponse.success("Story updated", mapToResponse(updated));
    }

    // DELETE
    @Transactional
    public ApiResponse<String> deleteStory(Long id) {

        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new StoryNotFoundException("Story not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUser.getRole());

        boolean isOwner = story.getAuthor() != null &&
                story.getAuthor().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Not allowed to delete this story");
        }

        likeRepository.deleteByStory(story);
        storyRepository.delete(story);

        return ApiResponse.success("Story deleted");
    }

    // MAPPER
    private StoryResponse mapToResponse(Story story) {

        long likes = likeRepository.countByStory(story);

        User currentUser = null;

        var auth = SecurityContextHolder.getContext().getAuthentication();
System.out.println("AUTH = " + auth);

if(auth != null){
    System.out.println("AUTH NAME = " + auth.getName());
}
        if (auth != null &&
                auth.isAuthenticated() &&
                !"anonymousUser".equals(auth.getName())) {

            String email = auth.getName();
            currentUser = userRepository.findByEmail(email).orElse(null);
        System.out.println("CURRENT USER = " + currentUser);
        }

        boolean liked = currentUser != null &&
                likeRepository.existsByStoryAndUser(story, currentUser);
        boolean bookmarked = currentUser != null &&
                bookmarkRepository.existsByStoryAndUser(story, currentUser);
        return StoryResponse.builder()
                .id(story.getId())
                .title(story.getTitle())
                .content(story.getContent())
                .status(story.getStatus())
                .likes(likes)
                .liked(liked)
                .bookmarked(bookmarked)
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .authorName(story.getAuthor() != null ? story.getAuthor().getName() : "Anonymous")
                .authorId(story.getAuthor() != null ? story.getAuthor().getId() : null)
                .build();

                
    }
}