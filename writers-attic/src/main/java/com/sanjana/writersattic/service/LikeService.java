package com.sanjana.writersattic.service;

import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import com.sanjana.writersattic.model.Like;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.model.User;
import com.sanjana.writersattic.repository.LikeRepository;
import com.sanjana.writersattic.repository.StoryRepository;
import com.sanjana.writersattic.repository.UserRepository;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    public LikeService(
            LikeRepository likeRepository,
            StoryRepository storyRepository,
            UserRepository userRepository) {

        this.likeRepository = likeRepository;
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
    }

    public String likeStory(Long storyId) {

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        String email = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getName();

User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        if (likeRepository.existsByStoryAndUser(story, user)) {
            return "Already liked";
        }

        Like like = Like.builder()
                .story(story)
                .user(user)
                .build();

        likeRepository.save(like);

        return "Story liked";
    }

    public String unlikeStory(Long storyId) {

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        String email = SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getName();

User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

        likeRepository.deleteByStoryAndUser(story, user);

        return "Story unliked";
    }

    public long getLikesCount(Long storyId) {

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        return likeRepository.countByStory(story);
    }
    public List<Like> getMyLikes() {

    String email = SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    return likeRepository.findByUser(user);
}
}