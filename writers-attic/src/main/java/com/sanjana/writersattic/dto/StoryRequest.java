package com.sanjana.writersattic.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoryRequest {

    private String title;
    private String content;
    private String status;
}