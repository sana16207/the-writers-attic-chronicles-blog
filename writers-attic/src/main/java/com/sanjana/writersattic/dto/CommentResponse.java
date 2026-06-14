package com.sanjana.writersattic.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private Long storyId;
    private LocalDateTime createdAt;
}