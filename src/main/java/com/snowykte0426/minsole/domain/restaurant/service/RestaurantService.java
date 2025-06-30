package com.snowykte0426.minsole.domain.restaurant.service;

import com.snowykte0426.minsole.domain.auth.entity.User;
import com.snowykte0426.minsole.domain.auth.repository.UserRepository;
import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantResponseDto;
import com.snowykte0426.minsole.domain.restaurant.entity.FavoriteRestaurantEntity;
import com.snowykte0426.minsole.domain.restaurant.entity.RestaurantEntity;
import com.snowykte0426.minsole.domain.restaurant.repository.FavoriteRestaurantRepository;
import com.snowykte0426.minsole.domain.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final FavoriteRestaurantRepository favoriteRestaurantRepository;
    private final UserRepository userRepository;

    public List<RestaurantResponseDto> getTopRatedRestaurants(Long userId) {
        List<RestaurantEntity> restaurants = restaurantRepository.findTop10ByOrderByRatingDesc();
        return mapToResponseDtos(restaurants, userId);
    }

    public List<RestaurantResponseDto> getBlueRibbonRestaurants(Long userId) {
        List<RestaurantEntity> restaurants = restaurantRepository.findByIsBlueRibbonTrue();
        return mapToResponseDtos(restaurants, userId);
    }

    public List<RestaurantResponseDto> getNearbyRestaurants(Double latitude, Double longitude, Double distance, Long userId) {
        List<RestaurantEntity> restaurants = restaurantRepository.findNearbyRestaurants(latitude, longitude, distance);
        return mapToResponseDtosWithDistance(restaurants, userId, latitude, longitude);
    }

    public List<RestaurantResponseDto> searchRestaurants(String keyword, Long userId) {
        List<RestaurantEntity> restaurants = restaurantRepository.searchRestaurants(keyword);
        return mapToResponseDtos(restaurants, userId);
    }

    public List<RestaurantResponseDto> getFavoriteRestaurants(Long userId) {
        List<RestaurantEntity> favoriteRestaurants = favoriteRestaurantRepository.findFavoriteRestaurantsByUserId(userId);
        return mapToResponseDtos(favoriteRestaurants, userId);
    }

    public RestaurantResponseDto getRestaurantById(Long restaurantId, Long userId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + restaurantId));
        
        boolean isFavorite = false;
        if (userId != null) {
            isFavorite = favoriteRestaurantRepository.existsByUserAndRestaurant(
                    userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found")),
                    restaurant
            );
        }
        
        return RestaurantResponseDto.fromEntity(restaurant, isFavorite, null);
    }

    @Transactional
    public void toggleFavorite(Long restaurantId, Long userId) {
        RestaurantEntity restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + restaurantId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        boolean exists = favoriteRestaurantRepository.existsByUserAndRestaurant(user, restaurant);
        
        if (exists) {
            favoriteRestaurantRepository.deleteByUserAndRestaurant(user, restaurant);
        } else {
            FavoriteRestaurantEntity favoriteRestaurant = FavoriteRestaurantEntity.builder()
                    .user(user)
                    .restaurant(restaurant)
                    .build();
            favoriteRestaurantRepository.save(favoriteRestaurant);
        }
    }

    private List<RestaurantResponseDto> mapToResponseDtos(List<RestaurantEntity> restaurants, Long userId) {
        return restaurants.stream()
                .map(restaurant -> {
                    boolean isFavorite = false;
                    if (userId != null) {
                        isFavorite = favoriteRestaurantRepository.existsByUserAndRestaurant(
                                userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found")),
                                restaurant
                        );
                    }
                    return RestaurantResponseDto.fromEntity(restaurant, isFavorite, null);
                })
                .collect(Collectors.toList());
    }

    private List<RestaurantResponseDto> mapToResponseDtosWithDistance(List<RestaurantEntity> restaurants, Long userId, 
                                                                      Double userLatitude, Double userLongitude) {
        return restaurants.stream()
                .map(restaurant -> {
                    boolean isFavorite = false;
                    if (userId != null) {
                        isFavorite = favoriteRestaurantRepository.existsByUserAndRestaurant(
                                userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found")),
                                restaurant
                        );
                    }
                    
                    String distance = calculateDistance(userLatitude, userLongitude, 
                                                      restaurant.getLatitude(), restaurant.getLongitude());
                    
                    return RestaurantResponseDto.fromEntity(restaurant, isFavorite, distance);
                })
                .collect(Collectors.toList());
    }

    private String calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return null;
        }
        
        final int R = 6371; // 지구 반경 (km)
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        
        if (distance < 1) {
            return Math.round(distance * 1000) + "m";
        } else {
            return Math.round(distance * 10) / 10.0 + "km";
        }
    }
}
