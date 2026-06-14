package com.sanjana.writersattic.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookmarkResponse {

    private Long id;
    private Long storyId;
    private String storyTitle;
}