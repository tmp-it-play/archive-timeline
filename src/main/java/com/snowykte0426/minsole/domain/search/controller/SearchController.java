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
        try {
            List<String> keywords = aiSearchService.fetchKeywords(limit);
            return ResponseEntity.ok(new KeywordListResponse(keywords));
        } catch (Exception e) {
            log.error("AI 키워드 가져오기 실패: {}", e.getMessage());
            // 기본 키워드 반환
            List<String> defaultKeywords = List.of("한식", "일식", "양식", "치킨", "피자");
            return ResponseEntity.ok(new KeywordListResponse(defaultKeywords));
        }
    }

    @GetMapping("/ai/recommend")
    public ResponseEntity<Map<String, List<AIFeignClient.RestaurantDto>>> aiRecommend(
            @RequestParam("keywords") String keywords
    ) {
        try {
            List<String> kwList = Arrays.stream(keywords.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            String sent = String.join(",", kwList);
            List<AIFeignClient.RestaurantDto> recs = aiSearchService.recommend(sent);
            return ResponseEntity.ok(
                    Collections.singletonMap("items", recs)
            );
        } catch (Exception e) {
            log.error("AI 추천 실패: {}", e.getMessage());
            // 빈 목록 반환으로 클라이언트가 폴백 처리하도록 함
            return ResponseEntity.ok(
                    Collections.singletonMap("items", Collections.emptyList())
            );
        }
    }
    public record KeywordListResponse(List<String> keywords) {}
}