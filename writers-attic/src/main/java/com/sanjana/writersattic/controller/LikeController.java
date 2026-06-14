package com.sanjana.writersattic.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sanjana.writersattic.service.LikeService;

@RestController
@RequestMapping("/api/stories")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{id}/like")
    public String likeStory(@PathVariable Long id) {
        return likeService.likeStory(id);
    }

    @DeleteMapping("/{id}/like")
    public String unlikeStory(@PathVariable Long id) {
        return likeService.unlikeStory(id);
    }

    @GetMapping("/{id}/likes")
    public long getLikesCount(@PathVariable Long id) {
        return likeService.getLikesCount(id);
    }
    @GetMapping("/test")
public String test() {
    return "Like Controller Working";
}
}