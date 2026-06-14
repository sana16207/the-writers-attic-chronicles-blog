package com.sanjana.writersattic.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.sanjana.writersattic.dto.CommentRequest;
import com.sanjana.writersattic.dto.CommentResponse;
import com.sanjana.writersattic.exception.StoryNotFoundException;
import com.sanjana.writersattic.model.Comment;
import com.sanjana.writersattic.model.Story;
import com.sanjana.writersattic.repository.CommentRepository;
import com.sanjana.writersattic.repository.StoryRepository;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final StoryRepository storyRepository;

    public CommentService(
            CommentRepository commentRepository,
            StoryRepository storyRepository) {

        this.commentRepository = commentRepository;
        this.storyRepository = storyRepository;
    }

    public CommentResponse createComment(CommentRequest request) {

        Story story = storyRepository.findById(request.getStoryId())
                .orElseThrow(() ->
                        new StoryNotFoundException("Story not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .story(story)
                .build();

        Comment saved = commentRepository.save(comment);

        return mapToResponse(saved);
    }

    public List<CommentResponse> getAllComments() {

        return commentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CommentResponse> getCommentsByStory(Long storyId) {

        return commentRepository.findByStoryId(storyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CommentResponse mapToResponse(Comment comment) {

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .storyId(comment.getStory().getId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}