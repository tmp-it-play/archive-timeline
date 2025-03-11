package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import com.snowykte0426.minsole.domain.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<List<SearchDto>> search(@RequestParam("query") String query) {
        List<SearchDto> searchDtoList = searchService.search(query);
        return ResponseEntity.ok(searchDtoList);
    }
}