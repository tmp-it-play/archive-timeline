package com.snowykte0426.minsole.domain.auth.controller;

import com.snowykte0426.minsole.domain.auth.dto.ApiResponse;
import com.snowykte0426.minsole.domain.auth.dto.UserResponse;
import com.snowykte0426.minsole.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.ok(ApiResponse.failure("사용자 정보를 찾을 수 없습니다."));
        }

        UserResponse userResponse = UserResponse.builder()
                .id(userPrincipal.getId())
                .name(userPrincipal.getName())
                .email(userPrincipal.getEmail())
                .build();

        return ResponseEntity.ok(ApiResponse.success(userResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        // JWT 토큰은 stateless이므로 클라이언트에서 토큰을 삭제하면 됨
        return ResponseEntity.ok(ApiResponse.success("로그아웃되었습니다."));
    }
}
