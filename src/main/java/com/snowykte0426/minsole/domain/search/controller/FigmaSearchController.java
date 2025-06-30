package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import com.snowykte0426.minsole.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FigmaSearchController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> search(@RequestBody Map<String, String> request) {
        try {
            String query = request.get("query");
            
            if (query == null || query.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "검색어를 입력해주세요"));
            }

            log.info("Figma 앱 검색 요청: {}", query);

            // 간단한 검색 로직 (실제로는 더 복잡한 검색 엔진 사용)
            List<RestaurantDto> results = restaurantService.getRecommendedRestaurants().stream()
                .filter(restaurant -> 
                    restaurant.getName().toLowerCase().contains(query.toLowerCase()) ||
                    restaurant.getCategory().toLowerCase().contains(query.toLowerCase()) ||
                    restaurant.getLocation().toLowerCase().contains(query.toLowerCase())
                )
                .limit(10)
                .toList();

            return ResponseEntity.ok(Map.of(
                "results", results,
                "total", results.size(),
                "query", query
            ));

        } catch (Exception e) {
            log.error("검색 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "검색 처리 중 오류가 발생했습니다"));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSearchSuggestions(
            @RequestParam(required = false) String query) {
        
        List<String> suggestions = List.of(
            "짬뽕", "떡갈비", "피자", "초밥", "치킨",
            "한식", "일식", "양식", "중식", "카페"
        );

        if (query != null && !query.trim().isEmpty()) {
            suggestions = suggestions.stream()
                .filter(suggestion -> suggestion.toLowerCase().contains(query.toLowerCase()))
                .toList();
        }

        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }
}