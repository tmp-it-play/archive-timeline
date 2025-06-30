//package com.snowykte0426.minsole.domain.mobile.controller;
//
//import com.snowykte0426.minsole.domain.mobile.dto.response.SearchResponse;
//import com.snowykte0426.minsole.domain.mobile.service.MobileSearchService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@Slf4j
//@RestController
//@RequestMapping("/api/mobile/search")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class MobileSearchController {
//
//    private final MobileSearchService mobileSearchService;
//
//    /**
//     * 통합 맛집 검색 (Figma 디자인의 검색 기능)
//     */
//    @PostMapping
//    public ResponseEntity<SearchResponse> searchRestaurants(@RequestBody Map<String, Object> request) {
//        String query = (String) request.get("query");
//        String location = (String) request.getOrDefault("location", "광주 광산구");
//
//        SearchResponse response = mobileSearchService.searchRestaurants(query, location);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 검색 자동완성 제안
//     */
//    @GetMapping("/suggestions")
//    public ResponseEntity<SearchResponse> getSearchSuggestions(
//            @RequestParam(required = false) String query) {
//
//        SearchResponse response = mobileSearchService.getSearchSuggestions(query);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 인기 검색어 조회
//     */
//    @GetMapping("/popular")
//    public ResponseEntity<SearchResponse> getPopularKeywords() {
//        SearchResponse response = mobileSearchService.getPopularKeywords();
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 최근 검색어 조회 (사용자별)
//     */
//    @GetMapping("/recent")
//    public ResponseEntity<SearchResponse> getRecentSearches(@RequestParam Long userId) {
//        SearchResponse response = mobileSearchService.getRecentSearches(userId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 검색어 저장 (사용자별 최근 검색어)
//     */
//    @PostMapping("/save")
//    public ResponseEntity<SearchResponse> saveSearchKeyword(@RequestBody Map<String, Object> request) {
//        Long userId = Long.valueOf(request.get("userId").toString());
//        String keyword = (String) request.get("keyword");
//
//        SearchResponse response = mobileSearchService.saveSearchKeyword(userId, keyword);
//        return ResponseEntity.ok(response);
//    }
//}
