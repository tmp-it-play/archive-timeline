//package com.snowykte0426.minsole.domain.mobile.controller;
//
//import com.snowykte0426.minsole.domain.mobile.dto.response.FavoriteResponse;
//import com.snowykte0426.minsole.domain.mobile.service.FavoriteService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/mobile/favorites")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class FavoriteController {
//
//    private final FavoriteService favoriteService;
//
//    /**
//     * 즐겨찾기 추가
//     */
//    @PostMapping
//    public ResponseEntity<FavoriteResponse> addFavorite(
//            @RequestParam Long userId,
//            @RequestBody Map<String, Long> request) {
//        Long restaurantId = request.get("restaurantId");
//        FavoriteResponse response = favoriteService.addFavorite(userId, restaurantId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 즐겨찾기 제거
//     */
//    @DeleteMapping
//    public ResponseEntity<FavoriteResponse> removeFavorite(
//            @RequestParam Long userId,
//            @RequestParam Long restaurantId) {
//        FavoriteResponse response = favoriteService.removeFavorite(userId, restaurantId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 사용자의 즐겨찾기 목록 조회
//     */
//    @GetMapping
//    public ResponseEntity<FavoriteResponse> getFavorites(@RequestParam Long userId) {
//        FavoriteResponse response = favoriteService.getFavorites(userId);
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 즐겨찾기 여부 확인
//     */
//    @GetMapping("/check")
//    public ResponseEntity<Map<String, Boolean>> checkFavorite(
//            @RequestParam Long userId,
//            @RequestParam Long restaurantId) {
//        boolean isFavorite = favoriteService.isFavorite(userId, restaurantId);
//        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
//    }
//}
