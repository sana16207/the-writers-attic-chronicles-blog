package com.sanjana.writersattic.exception;

public class StoryNotFoundException extends RuntimeException {

    public StoryNotFoundException(String message) {
        super(message);
    }
}