package com.snowykte0426.minsole.domain.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String profileImageUrl;
}
