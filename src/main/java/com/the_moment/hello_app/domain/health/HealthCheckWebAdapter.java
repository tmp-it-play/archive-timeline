package com.the_moment.hello_app.domain.health;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/health")
public class HealthCheckWebAdapter {

    @GetMapping
    public ResponseEntity<Boolean> healthCheck() {
        return ResponseEntity.ok(true);
    }

    @GetMapping("/error")
    public ResponseEntity<?> error() {
        return ResponseEntity.status(HttpStatus.VARIANT_ALSO_NEGOTIATES).body((byte) 0);
    }
}