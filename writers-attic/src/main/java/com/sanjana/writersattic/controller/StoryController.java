package com.sanjana.writersattic.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import com.sanjana.writersattic.dto.ApiResponse;
import com.sanjana.writersattic.dto.StoryRequest;
import com.sanjana.writersattic.dto.StoryResponse;
import com.sanjana.writersattic.service.StoryService;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    // CREATE
    @PostMapping
    public ApiResponse<StoryResponse> createStory(@RequestBody StoryRequest request) {
        return storyService.createStory(request);
    }

    // GET ALL
    @GetMapping
    public ApiResponse<Page<StoryResponse>> getAllStories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return storyService.getAllStories(pageable);
    }

    // SEARCH
    @GetMapping("/search")
    public ApiResponse<Page<StoryResponse>> searchStories(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return storyService.searchStories(keyword, pageable);
    }

    // GET BY ID (SAFE ROUTING FIX)
    @GetMapping("/{id:[0-9]+}")
    public ApiResponse<StoryResponse> getStoryById(@PathVariable Long id) {
        return storyService.getStoryById(id);
    }

    // UPDATE
    @PutMapping("/{id:[0-9]+}")
    public ApiResponse<StoryResponse> updateStory(
            @PathVariable Long id,
            @RequestBody StoryRequest request) {

        return storyService.updateStory(id, request);
    }

    // DELETE
    @DeleteMapping("/{id:[0-9]+}")
    public ApiResponse<String> deleteStory(@PathVariable Long id) {
        return storyService.deleteStory(id);
    }
}