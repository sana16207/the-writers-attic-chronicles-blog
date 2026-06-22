package com.sanjana.writersattic.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sanjana.writersattic.model.Bookmark;
import com.sanjana.writersattic.service.BookmarkService;

@RestController
@RequestMapping("/api")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/stories/{id}/bookmark")
    public String bookmarkStory(@PathVariable Long id) {
        return bookmarkService.bookmarkStory(id);
    }

    @DeleteMapping("/stories/{id}/bookmark")
    public String removeBookmark(@PathVariable Long id) {
        return bookmarkService.removeBookmark(id);
    }

    @GetMapping("/bookmarks")
    public List<Bookmark> getMyBookmarks() {
        return bookmarkService.getMyBookmarks();
    }
    
}