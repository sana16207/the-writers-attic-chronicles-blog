package com.sanjana.writersattic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.sanjana.writersattic.dto.CommentRequest;
import com.sanjana.writersattic.dto.CommentResponse;
import com.sanjana.writersattic.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public CommentResponse createComment(@RequestBody CommentRequest request) {
        return commentService.createComment(request);
    }

    @GetMapping
    public List<CommentResponse> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/story/{storyId}")
    public List<CommentResponse> getCommentsByStory(@PathVariable Long storyId) {
        return commentService.getCommentsByStory(storyId);
    }
}