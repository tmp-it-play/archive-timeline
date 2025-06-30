package com.snowykte0426.minsole.domain.restaurant.service;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    // 샘플 데이터 (실제로는 데이터베이스에서 조회)
    private final List<RestaurantDto> sampleRestaurants;

    public RestaurantService() {
        this.sampleRestaurants = createSampleData();
    }

    public List<RestaurantDto> getRecommendedRestaurants() {
        return sampleRestaurants.stream()
                .limit(6)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> getRestaurantsByCategory(String category, String location) {
        return sampleRestaurants.stream()
                .filter(restaurant -> category == null || 
                        restaurant.getCategory().equalsIgnoreCase(category))
                .filter(restaurant -> location == null || 
                        restaurant.getLocation().contains(location))
                .collect(Collectors.toList());
    }

    public RestaurantDto getRestaurantById(Long id) {
        return sampleRestaurants.stream()
                .filter(restaurant -> restaurant.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<RestaurantDto> getNearbyRestaurants(Double latitude, Double longitude) {
        // 실제로는 좌표 기반 거리 계산 로직 구현
        return sampleRestaurants.stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> getTodayRecommendations() {
        return sampleRestaurants.stream()
                .filter(restaurant -> restaurant.getRating() >= 4.5)
                .limit(3)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> getFavoriteRestaurants() {
        return sampleRestaurants.stream()
                .filter(RestaurantDto::getIsFavorite)
                .collect(Collectors.toList());
    }

    public List<RestaurantDto> getBlueRibbonRestaurants() {
        return sampleRestaurants.stream()
                .filter(RestaurantDto::getIsBlueRibbon)
                .collect(Collectors.toList());
    }

    private List<RestaurantDto> createSampleData() {
        List<RestaurantDto> restaurants = new ArrayList<>();

        restaurants.add(RestaurantDto.builder()
                .id(1L)
                .name("짬뽕관 광주송정선운점")
                .distance("450m")
                .location("광주 광산구 소촌동")
                .rating(4.9)
                .reviews(600)
                .minOrder("13,000원")
                .image("🍜")
                .category("중식")
                .phone("062-123-4567")
                .address("광주광역시 광산구 소촌동 123-45")
                .description("정통 중화요리 전문점")
                .operatingHours("10:00 - 22:00")
                .latitude(35.1379)
                .longitude(126.7934)
                .isFavorite(true)
                .isBlueRibbon(false)
                .build());

        restaurants.add(RestaurantDto.builder()
                .id(2L)
                .name("송정떡갈비1호점")
                .distance("454m")
                .location("광주 광산구 송정동")
                .rating(5.0)
                .reviews(2263)
                .minOrder("20,000원")
                .image("🥩")
                .category("한식")
                .phone("062-234-5678")
                .address("광주광역시 광산구 송정동 456-78")
                .description("광주 대표 떡갈비 맛집")
                .operatingHours("11:00 - 21:00")
                .latitude(35.1356)
                .longitude(126.7915)
                .isFavorite(false)
                .isBlueRibbon(true)
                .build());

        restaurants.add(RestaurantDto.builder()
                .id(3L)
                .name("맛있는 피자집")
                .distance("320m")
                .location("광주 광산구 소촌동")
                .rating(4.7)
                .reviews(856)
                .minOrder("15,000원")
                .image("🍕")
                .category("양식")
                .phone("062-345-6789")
                .address("광주광역시 광산구 소촌동 789-12")
                .description("수제 화덕 피자 전문점")
                .operatingHours("12:00 - 23:00")
                .latitude(35.1398)
                .longitude(126.7892)
                .isFavorite(true)
                .isBlueRibbon(true)
                .build());

        restaurants.add(RestaurantDto.builder()
                .id(4L)
                .name("행복한 초밥집")
                .distance("680m")
                .location("광주 광산구 송정동")
                .rating(4.8)
                .reviews(432)
                .minOrder("25,000원")
                .image("🍣")
                .category("일식")
                .phone("062-456-7890")
                .address("광주광역시 광산구 송정동 321-54")
                .description("신선한 회와 초밥을 제공하는 일식당")
                .operatingHours("17:00 - 24:00")
                .latitude(35.1334)
                .longitude(126.7945)
                .isFavorite(false)
                .isBlueRibbon(true)
                .build());

        restaurants.add(RestaurantDto.builder()
                .id(5L)
                .name("카페 민쏠")
                .distance("230m")
                .location("광주 광산구 소촌동")
                .rating(4.6)
                .reviews(289)
                .minOrder("8,000원")
                .image("☕")
                .category("카페")
                .phone("062-567-8901")
                .address("광주광역시 광산구 소촌동 654-87")
                .description("아늑한 분위기의 로스팅 카페")
                .operatingHours("08:00 - 22:00")
                .latitude(35.1401)
                .longitude(126.7867)
                .isFavorite(true)
                .isBlueRibbon(false)
                .build());

        restaurants.add(RestaurantDto.builder()
                .id(6L)
                .name("황금 치킨")
                .distance("520m")
                .location("광주 광산구 송정동")
                .rating(4.5)
                .reviews(1024)
                .minOrder("12,000원")
                .image("🍗")
                .category("치킨")
                .phone("062-678-9012")
                .address("광주광역시 광산구 송정동 987-65")
                .description("바삭하고 맛있는 치킨 전문점")
                .operatingHours("16:00 - 02:00")
                .latitude(35.1312)
                .longitude(126.7978)
                .isFavorite(false)
                .isBlueRibbon(false)
                .build());

        return restaurants;
    }
}