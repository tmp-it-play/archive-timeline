package com.snowykte0426.minsole.domain.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        // 간단한 하드코딩된 사용자 검증
        if (isValidUser(username, password)) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인 성공",
                "user", Map.of(
                    "username", username,
                    "role", "USER"
                ),
                "token", "mock-jwt-token-" + username
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "아이디 또는 비밀번호가 잘못되었습니다."
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "로그아웃 성공"
        ));
    }

    private boolean isValidUser(String username, String password) {
        // 하드코딩된 사용자 계정들
        return switch (username) {
            case "admin" -> "admin123".equals(password);
            case "user" -> "user123".equals(password);
            case "test" -> "test123".equals(password);
            case "demo" -> "demo123".equals(password);
            default -> false;
        };
    }
}