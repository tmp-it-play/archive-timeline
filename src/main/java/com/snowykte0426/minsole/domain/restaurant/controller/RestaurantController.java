package com.snowykte0426.minsole.domain.restaurant.controller;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantResponseDto;
import com.snowykte0426.minsole.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/top-rated")
    public ResponseEntity<List<RestaurantResponseDto>> getTopRatedRestaurants(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(restaurantService.getTopRatedRestaurants(userId));
    }

    @GetMapping("/blue-ribbon")
    public ResponseEntity<List<RestaurantResponseDto>> getBlueRibbonRestaurants(
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(restaurantService.getBlueRibbonRestaurants(userId));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<RestaurantResponseDto>> getNearbyRestaurants(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "1.0") Double distance,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(restaurantService.getNearbyRestaurants(latitude, longitude, distance, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RestaurantResponseDto>> searchRestaurants(
            @RequestParam String keyword,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(restaurantService.searchRestaurants(keyword, userId));
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RestaurantResponseDto>> getFavoriteRestaurants(
            @RequestParam Long userId) {
        return ResponseEntity.ok(restaurantService.getFavoriteRestaurants(userId));
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<RestaurantResponseDto> getRestaurantById(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(restaurantId, userId));
    }

    @PostMapping("/{restaurantId}/favorite")
    public ResponseEntity<Void> toggleFavorite(
            @PathVariable Long restaurantId,
            @RequestParam Long userId) {
        restaurantService.toggleFavorite(restaurantId, userId);
        return ResponseEntity.ok().build();
    }
}
