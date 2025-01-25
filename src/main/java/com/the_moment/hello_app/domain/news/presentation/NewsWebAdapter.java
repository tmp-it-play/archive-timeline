package com.the_moment.hello_app.domain.news.presentation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/news")
public class NewsWebAdapter {

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello World");
    }
}
