package com.sanjana.writersattic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private String message;
    private T data;
    private boolean success;

    // ✅ ADD THIS (VERY IMPORTANT FIX)
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(message, data, true);
    }

    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(message, null, true);
    }
}