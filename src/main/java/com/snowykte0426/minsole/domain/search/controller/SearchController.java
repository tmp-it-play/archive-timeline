package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.search.dto.*;
import com.snowykte0426.minsole.domain.search.service.AISearchService;
import com.snowykte0426.minsole.domain.search.service.KeywordRecommendService;
import com.snowykte0426.minsole.domain.search.service.SearchService;
import com.snowykte0426.minsole.domain.search.service.util.AIFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;
    private final KeywordRecommendService recommendService;
    private final AISearchService aiSearchService;

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
    public ResponseEntity<?> aiKeywords(@RequestParam(name="limit", defaultValue="10") int limit) {
        List<String> keywords = aiSearchService.fetchKeywords(limit);
        return ResponseEntity.ok(new KeywordListResponse(keywords));
    }

    @GetMapping("/ai/recommend")
    public ResponseEntity<Map<String, List<AIFeignClient.RestaurantDto>>> aiRecommend(
            @RequestParam("keywords") String keywords
    ) {
        // comma-separated string → List<String> 처리 (필요 없으면 생략)
        List<String> kwList = Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        // Feign client 에는 그냥 원문을 보내도록 했으므로, 필요하다면 join:
        String sent = String.join(",", kwList);
        List<AIFeignClient.RestaurantDto> recs = aiSearchService.recommend(sent);

        // Front-end 가 json.items 로 접근하니 items 키로 감싸서 반환
        return ResponseEntity.ok(
                Collections.singletonMap("items", recs)
        );
    }
    public record KeywordListResponse(List<String> keywords) {}
}