package com.snowykte0426.minsole.domain.restaurant.controller;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import com.snowykte0426.minsole.domain.restaurant.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/recommended")
    public ResponseEntity<List<RestaurantDto>> getRecommendedRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getRecommendedRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getRestaurantsByCategory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        List<RestaurantDto> restaurants = restaurantService.getRestaurantsByCategory(category, location);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable Long id) {
        RestaurantDto restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }

    @PostMapping("/nearby")
    public ResponseEntity<List<RestaurantDto>> getNearbyRestaurants(
            @RequestBody Map<String, Double> location) {
        Double latitude = location.get("latitude");
        Double longitude = location.get("longitude");
        List<RestaurantDto> restaurants = restaurantService.getNearbyRestaurants(latitude, longitude);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/today")
    public ResponseEntity<List<RestaurantDto>> getTodayRecommendations() {
        List<RestaurantDto> restaurants = restaurantService.getTodayRecommendations();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<RestaurantDto>> getFavoriteRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getFavoriteRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/blue-ribbon")
    public ResponseEntity<List<RestaurantDto>> getBlueRibbonRestaurants() {
        List<RestaurantDto> restaurants = restaurantService.getBlueRibbonRestaurants();
        return ResponseEntity.ok(restaurants);
    }
}