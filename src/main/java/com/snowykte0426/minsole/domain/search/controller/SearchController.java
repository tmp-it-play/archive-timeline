package com.snowykte0426.minsole.domain.search.controller;

import com.snowykte0426.minsole.domain.search.dto.*;
import com.snowykte0426.minsole.domain.search.service.AISearchService;
import com.snowykte0426.minsole.domain.search.service.KeywordRecommendService;
import com.snowykte0426.minsole.domain.search.service.SearchService;
import com.snowykte0426.minsole.domain.search.service.util.AIFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;
    private final KeywordRecommendService recommendService;
    private final AISearchService aiSearchService;
    
    @Value("${app.search.max-results:100}")
    private int maxResults;
    
    @Value("${app.location.default-radius:3.0}")
    private double defaultRadius;
    
    @Value("${app.location.max-radius:10.0}")
    private double maxRadius;

    @GetMapping
    public ResponseEntity<?> search(
            @RequestParam String type,
            @RequestParam("q") String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy
    ) {
        try {
            // 입력 검증
            if (!StringUtils.hasText(query)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "검색어를 입력해주세요"));
            }
            
            if (query.length() > 100) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "검색어는 100자 이내로 입력해주세요"));
            }

            if ("db".equals(type)) {
                SearchResponse<DbDataDto> resp = searchService.searchDb(query, category, minRating);
                
                // 위치 기반 정렬 적용
                if (StringUtils.hasText(location)) {
                    resp = filterByLocation(resp, location);
                }
                
                resp = sortResults(resp, sortBy);
                resp = limitResults(resp, maxResults);
                
                log.info("DB 검색 완료: 쿼리='{}', 결과={}개", query, resp.getItems().size());
                return ResponseEntity.ok(resp);
                
            } else {
                SearchResponse<SearchDto> resp = searchService.searchLocalCross(type, query, category);
                
                // 결과 제한 (반환 타입이 SearchDto이므로 별도 처리)
                List<SearchDto> limitedItems = resp.getItems().stream()
                    .limit(maxResults)
                    .collect(Collectors.toList());
                SearchResponse<SearchDto> limitedResp = new SearchResponse<>(limitedItems, resp.getFacets());
                
                log.info("로컬/교차 검색 완료: 타입='{}', 쿼리='{}', 결과={}개", type, query, limitedResp.getItems().size());
                return ResponseEntity.ok(limitedResp);
            }
            
        } catch (Exception e) {
            log.error("검색 처리 중 오류 발생: query='{}', type='{}'", query, type, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "검색 처리 중 오류가 발생했습니다"));
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> searchNearby(
            @RequestParam String location,
            @RequestParam(required = false) Double radius,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "distance") String sortBy
    ) {
        try {
            // 입력 검증
            if (!StringUtils.hasText(location)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "위치를 입력해주세요"));
            }
            
            double searchRadius = validateRadius(radius);
            
            // 위치 기반 검색 수행
            SearchResponse<DbDataDto> resp = searchService.searchDb("", category, null);
            resp = filterByLocationAndRadius(resp, location, searchRadius);
            resp = sortResults(resp, sortBy);
            resp = limitResults(resp, maxResults);
            
            log.info("근처 맛집 검색 완료: 위치='{}', 반경={}km, 결과={}개", 
                location, searchRadius, resp.getItems().size());
                
            return ResponseEntity.ok(resp);
            
        } catch (IllegalArgumentException e) {
            log.warn("잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("근처 맛집 검색 실패: location='{}'", location, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "근처 맛집 검색 중 오류가 발생했습니다"));
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingRestaurants(
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "10") int limit
    ) {
        try {
            // 입력 검증
            if (limit <= 0 || limit > 50) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "조회 개수는 1-50 사이여야 합니다"));
            }
            
            // 인기 맛집 (평점 4.0 이상, 평점순 정렬)
            SearchResponse<DbDataDto> resp = searchService.searchDb("", null, 4.0);
            
            List<DbDataDto> trendingList = resp.getItems().stream()
                .filter(item -> item.getNaverRating() != null && item.getNaverRating() >= 4.0)
                .sorted((a, b) -> Double.compare(
                    b.getNaverRating() != null ? b.getNaverRating() : 0.0,
                    a.getNaverRating() != null ? a.getNaverRating() : 0.0
                ))
                .limit(limit)
                .collect(Collectors.toList());
                
            log.info("인기 맛집 조회 완료: 위치='{}', 결과={}개", location, trendingList.size());
            return ResponseEntity.ok(new SearchResponse<>(trendingList, new Facets(Collections.emptyList())));
            
        } catch (Exception e) {
            log.error("인기 맛집 조회 실패: location='{}'", location, e);
            return ResponseEntity.internalServerError()
                .body(Map.of("error", "인기 맛집 조회 중 오류가 발생했습니다"));
        }
    }

    @PostMapping("/favorite")
    public ResponseEntity<?> toggleFavorite(
            @RequestBody FavoriteRequest request
    ) {
        // 실제로는 사용자별 즐겨찾기 DB에 저장
        log.info("즐겨찾기 토글: 사용자={}, 맛집ID={}", request.userId(), request.restaurantId());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "favorited", !request.isFavorited() // 토글
        ));
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@RequestParam String userId) {
        // 실제로는 사용자별 즐겨찾기 조회
        try {
            // 임시로 랜덤한 인기 맛집 반환
            SearchResponse<DbDataDto> resp = searchService.searchDb("", null, 4.5);
            List<DbDataDto> favorites = resp.getItems().stream()
                .limit(5)
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(new SearchResponse<>(favorites, new Facets(Collections.emptyList())));
        } catch (Exception e) {
            return ResponseEntity.ok(new SearchResponse<>(Collections.emptyList(), new Facets(Collections.emptyList())));
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getRestaurantDetail(@PathVariable String id) {
        try {
            // ID로 상세 정보 조회 (실제로는 repository에서 조회)
            SearchResponse<DbDataDto> resp = searchService.searchDb("", null, null);
            
            Optional<DbDataDto> restaurant = resp.getItems().stream()
                .filter(item -> item.getId().toString().equals(id))
                .findFirst();
                
            if (restaurant.isPresent()) {
                DbDataDto detail = restaurant.get();
                
                // 상세 정보 구성
                Map<String, Object> detailInfo = Map.of(
                    "restaurant", detail,
                    "isOpen", isCurrentlyOpen(), // 영업시간 체크
                    "openingHours", getOpeningHours(),
                    "facilities", List.of("주차가능", "WiFi", "포장가능", "배달가능"),
                    "nearbyPlaces", getNearbyPlaces(detail.getRoadAddr())
                );
                
                return ResponseEntity.ok(detailInfo);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("맛집 상세 정보 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
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
    public ResponseEntity<?> aiRecommend(
            @RequestParam("keywords") String keywords
    ) {
        try {
            // 입력 검증
            if (!StringUtils.hasText(keywords)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "키워드를 입력해주세요"));
            }
            
            List<String> kwList = Arrays.stream(keywords.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .limit(10)  // 키워드 개수 제한
                    .toList();
                    
            if (kwList.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "올바른 키워드를 입력해주세요"));
            }
            
            String sent = String.join(",", kwList);
            List<AIFeignClient.RestaurantDto> recs = aiSearchService.recommend(sent);
            
            log.info("AI 추천 완료: 키워드='{}', 결과={}개", sent, recs.size());
            return ResponseEntity.ok(Map.of("items", recs));
            
        } catch (Exception e) {
            log.error("AI 추천 실패: keywords='{}'", keywords, e);
            // 빈 목록 반환으로 클라이언트가 폴백 처리하도록 함
            return ResponseEntity.ok(Map.of("items", Collections.emptyList()));
        }
    }

    // Helper methods
    
    /**
     * 반경 값 검증 및 정규화
     */
    private double validateRadius(Double radius) {
        if (radius == null) {
            return defaultRadius;
        }
        if (radius <= 0) {
            throw new IllegalArgumentException("반경은 0보다 커야 합니다");
        }
        if (radius > maxRadius) {
            throw new IllegalArgumentException("반경은 " + maxRadius + "km 이하여야 합니다");
        }
        return radius;
    }
    
    /**
     * 결과 개수 제한
     */
    private <T> SearchResponse<T> limitResults(SearchResponse<T> resp, int limit) {
        if (resp.getItems().size() <= limit) {
            return resp;
        }
        List<T> limited = resp.getItems().stream()
            .limit(limit)
            .collect(Collectors.toList());
        return new SearchResponse<>(limited, resp.getFacets());
    }

    private SearchResponse<DbDataDto> filterByLocation(SearchResponse<DbDataDto> resp, String location) {
        List<DbDataDto> filtered = resp.getItems().stream()
            .filter(item -> {
                String roadAddr = item.getRoadAddr();
                String jibunAddr = item.getJibunAddr();
                return (roadAddr != null && roadAddr.contains(location)) ||
                       (jibunAddr != null && jibunAddr.contains(location));
            })
            .collect(Collectors.toList());
        return new SearchResponse<>(filtered, resp.getFacets());
    }

    private SearchResponse<DbDataDto> filterByLocationAndRadius(SearchResponse<DbDataDto> resp, String location, Double radius) {
        // TODO: 실제 GPS 좌표 기반 거리 계산 구현 필요
        // 현재는 단순 주소 매칭으로 처리
        List<DbDataDto> filtered = resp.getItems().stream()
            .filter(item -> {
                String roadAddr = item.getRoadAddr();
                String jibunAddr = item.getJibunAddr();
                return (roadAddr != null && roadAddr.contains(location)) ||
                       (jibunAddr != null && jibunAddr.contains(location));
            })
            .limit(Math.min(100, maxResults)) // 성능을 위한 제한
            .collect(Collectors.toList());
        return new SearchResponse<>(filtered, resp.getFacets());
    }

    private SearchResponse<DbDataDto> sortResults(SearchResponse<DbDataDto> resp, String sortBy) {
        List<DbDataDto> sorted = new ArrayList<>(resp.getItems());
        
        switch (sortBy) {
            case "rating" -> sorted.sort((a, b) -> {
                Double ratingA = a.getNaverRating() != null ? a.getNaverRating() : 0.0;
                Double ratingB = b.getNaverRating() != null ? b.getNaverRating() : 0.0;
                return Double.compare(ratingB, ratingA); // 내림차순
            });
            case "name" -> sorted.sort((a, b) -> {
                String nameA = a.getBizName() != null ? a.getBizName() : "";
                String nameB = b.getBizName() != null ? b.getBizName() : "";
                return nameA.compareTo(nameB);
            });
            case "distance" -> {
                // TODO: 실제 사용자 위치 기반 거리 계산 구현
                Collections.shuffle(sorted); // 임시로 랜덤 정렬
            }
            default -> {
                // relevance - 기본 순서 유지
            }
        }
        
        return new SearchResponse<>(sorted, resp.getFacets());
    }

    private boolean isCurrentlyOpen() {
        LocalTime now = LocalTime.now();
        return now.isAfter(LocalTime.of(9, 0)) && now.isBefore(LocalTime.of(22, 0));
    }

    private String getOpeningHours() {
        return "09:00 - 22:00 (매일)";
    }

    private List<String> getNearbyPlaces(String address) {
        if (!StringUtils.hasText(address)) {
            return Collections.emptyList();
        }
        return List.of("지하철역 도보 5분", "버스정류장 도보 2분", "공영주차장 이용가능");
    }

    // 내부 클래스
    public record KeywordListResponse(List<String> keywords) {}
    public record FavoriteRequest(String userId, String restaurantId, boolean isFavorited) {}
}