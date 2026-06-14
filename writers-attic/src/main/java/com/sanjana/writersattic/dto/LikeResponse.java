package com.sanjana.writersattic.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikeResponse {

    private Long id;
    private Long storyId;
    private long likeCount;
}