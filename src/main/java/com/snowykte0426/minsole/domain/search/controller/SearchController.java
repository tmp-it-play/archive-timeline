package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.search.dto.DbDataDto;
import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import com.snowykte0426.minsole.domain.search.service.KeywordRecommendService;
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
    private final KeywordRecommendService keywordRecommendService;

    @GetMapping("/search")
    public ResponseEntity<List<SearchDto>> search(@RequestParam("query") String query) {
        List<SearchDto> searchDtoList = searchService.search(query);
        return ResponseEntity.ok(searchDtoList);
    }

    @GetMapping("/db/search")
    public ResponseEntity<List<DbDataDto>> searchDb(@RequestParam("query") String query) {
        List<DbDataDto> searchDtoList = searchService.searchDb(query);
        return ResponseEntity.ok(searchDtoList);
    }

    @GetMapping("/cross/search")
    public ResponseEntity<List<SearchDto>> crossSearch(@RequestParam("query") String query) {
        List<SearchDto> validated = searchService.crossValidatedSearch(query);
        return ResponseEntity.ok(validated);
    }

    @GetMapping("/ai/recommend")
    public ResponseEntity<List<SearchDto>> aiRecommend(
            @RequestParam("keywords") String keywords) {
        List<SearchDto> recommendations = keywordRecommendService.recommend(keywords);
        return ResponseEntity.ok(recommendations);
    }
}