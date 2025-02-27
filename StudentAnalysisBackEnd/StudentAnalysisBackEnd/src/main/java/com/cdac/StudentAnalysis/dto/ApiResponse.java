package com.cdac.StudentAnalysis.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ApiResponse {
    private String message;
    private Object data;
    private HttpStatus status;  

    // Factory methods for cleaner API responses
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(message, data, HttpStatus.OK);
    }

    public static ApiResponse success(String message) {
        return new ApiResponse(message, null, HttpStatus.OK);
    }

    public static ApiResponse failure(String message, HttpStatus status) {
        return new ApiResponse(message, null, status);
    }

    public static ApiResponse failure(String message, Object data, HttpStatus status) {
        return new ApiResponse(message, data, status);
    }

	public ApiResponse(String message, Object data) {
		super();
		this.message = message;
		this.data = data;
	}
}
