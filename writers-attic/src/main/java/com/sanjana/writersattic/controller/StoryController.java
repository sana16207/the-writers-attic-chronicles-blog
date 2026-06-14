package com.sanjana.writersattic.controller;

import java.util.List;

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

    @PostMapping
    public ApiResponse<StoryResponse> createStory(@RequestBody StoryRequest request) {
        return storyService.createStory(request);
    }

    @GetMapping
    public ApiResponse<List<StoryResponse>> getAllStories() {
        return storyService.getAllStories();
    }

    @GetMapping("/{id}")
    public ApiResponse<StoryResponse> getStoryById(@PathVariable Long id) {
        return storyService.getStoryById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<StoryResponse> updateStory(
            @PathVariable Long id,
            @RequestBody StoryRequest request) {

        return storyService.updateStory(id, request);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteStory(@PathVariable Long id) {
        return storyService.deleteStory(id);
    }
}