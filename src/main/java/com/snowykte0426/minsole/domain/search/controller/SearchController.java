package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.search.dto.*;
import com.snowykte0426.minsole.domain.search.service.AIKeywordService;
import com.snowykte0426.minsole.domain.search.service.KeywordRecommendService;
import com.snowykte0426.minsole.domain.search.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;
    private final KeywordRecommendService recommendService;
    private final AIKeywordService aiKeywordService;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String type,
            @RequestParam("q") String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating
    ) {
        if ("db".equals(type)) {
            SearchResponse<DbDataDto> resp = searchService.searchDb(query, category, minRating);
            return ResponseEntity.ok(resp);
        } else {
            SearchResponse<SearchDto> resp = searchService.searchLocalCross(type, query, category);
            return ResponseEntity.ok(resp);
        }
    }

    @GetMapping("/recommend")
    public ResponseEntity<RecommendResponse> recommend(
            @RequestParam("keywords") String keywords,
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ) {
        RecommendResponse recs = recommendService.recommend(keywords, limit);
        log.info("AI recommend tokens => {}", recs);
        return ResponseEntity.ok(recs);
    }


    @GetMapping("/ai/keywords")
    public ResponseEntity<KeywordResponse> aiKeywords(
            @RequestParam(name="limit", defaultValue="20") int limit
    ) {
        List<String> keys = aiKeywordService.generateByPython(limit);
        return ResponseEntity.ok(new KeywordResponse(keys));
    }
}