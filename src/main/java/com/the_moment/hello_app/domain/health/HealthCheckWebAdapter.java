package com.the_moment.hello_app.domain.health;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/news")
public class HealthCheckWebAdapter {

    @GetMapping
    public ResponseEntity<Boolean> healthCheck() {
        return ResponseEntity.ok(true);
    }
}