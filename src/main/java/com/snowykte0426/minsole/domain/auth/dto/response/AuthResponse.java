package com.snowykte0426.minsole.domain.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long userId;
    private String username;
    private String nickname;
    private String email;
    private String preferredLocation;
    private List<String> preferredCategories;
    private String token;
    private String message;
    private boolean success;
}
