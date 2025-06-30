package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantResponseDto;
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

            // 실제 데이터베이스에서 검색
            // userId는 현재 컨트롤러에서는 사용하지 않으므로 null로 전달
            List<RestaurantResponseDto> results = restaurantService.searchRestaurants(query.trim(), null);
            
            // RestaurantResponseDto를 RestaurantDto로 변환
            List<RestaurantDto> dtoResults = results.stream()
                .map(this::convertToRestaurantDto)
                .toList();

            log.info("검색 결과: {}개 맛집 발견", results.size());

            return ResponseEntity.ok(Map.of(
                "results", dtoResults,
                "total", dtoResults.size(),
                "query", query,
                "success", true
            ));

        } catch (Exception e) {
            log.error("검색 처리 중 오류 발생", e);
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "error", "검색 처리 중 오류가 발생했습니다",
                    "success", false
                ));
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getSearchSuggestions(
            @RequestParam(required = false) String query) {
        
        // 카테고리 기반 검색 제안
        List<String> suggestions = List.of(
            "짬뽕", "떡갈비", "피자", "초밥", "치킨", "햄버거",
            "한식", "일식", "양식", "중식", "카페", "디저트",
            "갈비", "삼겹살", "파스타", "라멘", "돈카츠"
        );

        if (query != null && !query.trim().isEmpty()) {
            suggestions = suggestions.stream()
                .filter(suggestion -> suggestion.toLowerCase().contains(query.toLowerCase()))
                .toList();
        }

        return ResponseEntity.ok(Map.of(
            "suggestions", suggestions,
            "query", query != null ? query : ""
        ));
    }

    @GetMapping("/popular")
    public ResponseEntity<Map<String, Object>> getPopularKeywords() {
        
        List<String> popularKeywords = List.of(
            "짬뽕", "떡갈비", "치킨", "피자", "한식", 
            "일식", "중식", "카페", "디저트", "양식"
        );
        
        return ResponseEntity.ok(Map.of(
            "keywords", popularKeywords,
            "success", true
        ));
    }
    
    /**
     * RestaurantResponseDto를 RestaurantDto로 변환
     */
    private RestaurantDto convertToRestaurantDto(RestaurantResponseDto responseDto) {
        return RestaurantDto.builder()
                .id(responseDto.getId())
                .name(responseDto.getName())
                .distance(responseDto.getDistance())
                .location(responseDto.getAddress())
                .rating(responseDto.getRating())
                .reviews(responseDto.getReviewCount())
                .minOrder(responseDto.getMinOrderPrice() != null ? responseDto.getMinOrderPrice() + "원" : null)
                .image(responseDto.getImageUrl())
                .category(responseDto.getCategory())
                .phone(responseDto.getPhoneNumber())
                .address(responseDto.getRoadAddress() != null ? responseDto.getRoadAddress() : responseDto.getAddress())
                .latitude(responseDto.getLatitude())
                .longitude(responseDto.getLongitude())
                .isFavorite(responseDto.getIsFavorite())
                .isBlueRibbon(responseDto.getIsBlueRibbon())
                .build();
    }
}