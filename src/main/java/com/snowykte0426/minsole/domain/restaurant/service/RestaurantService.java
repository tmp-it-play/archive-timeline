package com.snowykte0426.minsole.domain.restaurant.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantService {

    private final DataJpaRepository dataJpaRepository;

    // 카테고리 매핑 (Figma 디자인의 카테고리 -> 데이터베이스 food_type/main_food)
    private static final Map<String, List<String>> CATEGORY_MAPPING;
    static {
        Map<String, List<String>> mapping = new HashMap<>();
        mapping.put("한식", List.of("한식", "한정식", "백반", "김치찌개", "된장찌개", "갈비", "삼겹살", "불고기", "비빔밥", "냉면"));
        mapping.put("중식", List.of("중식", "중국음식", "짜장면", "짬뽕", "탕수육", "마파두부", "양장피"));
        mapping.put("일식", List.of("일식", "일본음식", "초밥", "사시미", "라멘", "우동", "카츠", "돈카츠", "회"));
        mapping.put("양식", List.of("양식", "서양음식", "스테이크", "파스타", "피자", "리조또", "샐러드"));
        mapping.put("치킨", List.of("치킨", "닭", "프라이드치킨", "양념치킨", "후라이드"));
        mapping.put("피자", List.of("피자"));
        mapping.put("햄버거", List.of("햄버거", "버거"));
        mapping.put("카페", List.of("카페", "커피", "음료", "디저트", "빵", "케이크"));
        mapping.put("디저트", List.of("디저트", "케이크", "아이스크림", "빙수", "팥빙수"));
        mapping.put("도시락", List.of("도시락", "분식"));
        mapping.put("아시안", List.of("아시아", "태국", "베트남", "인도", "동남아"));
        mapping.put("샌드위치", List.of("샌드위치", "토스트"));
        mapping.put("샐러드", List.of("샐러드"));
        mapping.put("빵", List.of("빵", "베이커리", "제과"));
        CATEGORY_MAPPING = Collections.unmodifiableMap(mapping);
    }

    // 이모지 매핑
    private static final Map<String, String> EMOJI_MAPPING;
    static {
        Map<String, String> emojiMap = new HashMap<>();
        emojiMap.put("한식", "🍚");
        emojiMap.put("중식", "🍜");
        emojiMap.put("일식", "🍣");
        emojiMap.put("양식", "🍝");
        emojiMap.put("치킨", "🍗");
        emojiMap.put("피자", "🍕");
        emojiMap.put("햄버거", "🍔");
        emojiMap.put("카페", "☕");
        emojiMap.put("디저트", "🧁");
        emojiMap.put("도시락", "🍱");
        emojiMap.put("아시안", "🥡");
        emojiMap.put("샌드위치", "🥪");
        emojiMap.put("샐러드", "🥗");
        emojiMap.put("빵", "🥐");
        EMOJI_MAPPING = Collections.unmodifiableMap(emojiMap);
    }

    public List<RestaurantDto> getRecommendedRestaurants() {
        try {
            Pageable pageable = PageRequest.of(0, 20, Sort.by("naverRating").descending());
            List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
            
            return entities.stream()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() > 0)
                .map(this::convertToDto)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("추천 레스토랑 조회 실패", e);
            return Collections.emptyList();
        }
    }

    public List<RestaurantDto> getRestaurantsByCategory(String category, String location) {
        try {
            List<String> keywords = CATEGORY_MAPPING.getOrDefault(category, List.of(category));
            List<DataJpaEntity> entities = new ArrayList<>();
            
            for (String keyword : keywords) {
                Pageable pageable = PageRequest.of(0, 10);
                List<DataJpaEntity> found = dataJpaRepository
                    .findByBizNameContainingIgnoreCaseOrMainFoodContainingIgnoreCase(keyword, keyword, pageable);
                entities.addAll(found);
            }
            
            // 중복 제거 및 평점 정렬
            List<RestaurantDto> results = entities.stream()
                .distinct()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() > 0)
                .map(this::convertToDto)
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(20)
                .collect(Collectors.toList());
                
            log.info("카테고리 '{}' 검색 결과: {}개", category, results.size());
            return results;
            
        } catch (Exception e) {
            log.error("카테고리별 레스토랑 조회 실패: {}", category, e);
            return Collections.emptyList();
        }
    }

    public RestaurantDto getRestaurantById(Long id) {
        try {
            Optional<DataJpaEntity> entity = dataJpaRepository.findById(id);
            return entity.map(this::convertToDto).orElse(null);
        } catch (Exception e) {
            log.error("레스토랑 상세 조회 실패: {}", id, e);
            return null;
        }
    }

    public List<RestaurantDto> searchRestaurants(String query) {
        try {
            Pageable pageable = PageRequest.of(0, 20);
            List<DataJpaEntity> entities = dataJpaRepository
                .findByBizNameContainingIgnoreCaseOrMainFoodContainingIgnoreCase(query, query, pageable);
            
            return entities.stream()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() > 0)
                .map(this::convertToDto)
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("레스토랑 검색 실패: {}", query, e);
            return Collections.emptyList();
        }
    }

    public List<RestaurantDto> getNearbyRestaurants(Double latitude, Double longitude) {
        // 위치 기반 검색은 현재 DB에 좌표 정보가 없으므로 일반 추천으로 대체
        return getRecommendedRestaurants().stream().limit(10).collect(Collectors.toList());
    }

    public List<RestaurantDto> getTodayRecommendations() {
        try {
            // 평점 4.5 이상의 맛집들
            Pageable pageable = PageRequest.of(0, 15, Sort.by("naverRating").descending());
            List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
            
            return entities.stream()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.5)
                .map(this::convertToDto)
                .limit(10)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("오늘의 추천 조회 실패", e);
            return Collections.emptyList();
        }
    }

    public List<RestaurantDto> getFavoriteRestaurants() {
        try {
            // 평점이 높은 인기 맛집들로 대체
            Pageable pageable = PageRequest.of(0, 10, Sort.by("naverRating").descending());
            List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
            
            return entities.stream()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.0)
                .map(this::convertToDto)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("즐겨찾기 레스토랑 조회 실패", e);
            return Collections.emptyList();
        }
    }

    public List<RestaurantDto> getBlueRibbonRestaurants() {
        try {
            // 평점 4.8 이상의 고급 맛집들
            Pageable pageable = PageRequest.of(0, 10, Sort.by("naverRating").descending());
            List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
            
            return entities.stream()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.8)
                .map(this::convertToDto)
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("블루리본 레스토랑 조회 실패", e);
            return Collections.emptyList();
        }
    }

    // Entity를 DTO로 변환
    private RestaurantDto convertToDto(DataJpaEntity entity) {
        String category = determineCategoryFromFood(entity.getMainFood(), entity.getFoodType());
        String emoji = EMOJI_MAPPING.getOrDefault(category, "🍽️");
        
        // 거리 계산 (실제로는 GPS 좌표 기반으로 계산해야 함)
        String distance = generateRandomDistance();
        
        // 리뷰 수 생성 (실제 데이터가 없으므로 평점 기반으로 추정)
        Integer reviews = generateReviewCount(entity.getNaverRating());
        
        // 최소 주문 금액 생성
        String minOrder = generateMinOrder(category);

        return RestaurantDto.builder()
            .id(entity.getId())
            .name(entity.getBizName())
            .distance(distance)
            .location(extractLocationFromAddress(entity.getRoadAddr(), entity.getJibunAddr()))
            .rating(entity.getNaverRating() != null ? entity.getNaverRating() : 0.0)
            .reviews(reviews)
            .minOrder(minOrder)
            .image(emoji)
            .category(category)
            .phone(entity.getPhoneNum())
            .address(entity.getRoadAddr() != null ? entity.getRoadAddr() : entity.getJibunAddr())
            .description(generateDescription(category, entity.getMainFood()))
            .operatingHours("10:00 - 22:00")
            .latitude(null) // 현재 DB에 좌표 정보 없음
            .longitude(null)
            .isFavorite(false)
            .isBlueRibbon(entity.getNaverRating() != null && entity.getNaverRating() >= 4.8)
            .build();
    }

    // 음식 종류에서 카테고리 판단
    private String determineCategoryFromFood(String mainFood, String foodType) {
        if (mainFood == null && foodType == null) return "기타";
        
        String food = (mainFood != null ? mainFood : foodType).toLowerCase();
        
        for (Map.Entry<String, List<String>> entry : CATEGORY_MAPPING.entrySet()) {
            if (entry.getValue().stream().anyMatch(keyword -> food.contains(keyword.toLowerCase()))) {
                return entry.getKey();
            }
        }
        
        return "기타";
    }

    // 주소에서 지역 정보 추출
    private String extractLocationFromAddress(String roadAddr, String jibunAddr) {
        String address = roadAddr != null ? roadAddr : jibunAddr;
        if (address == null) return "위치 정보 없음";
        
        // 주소에서 구/군/시 정보 추출
        String[] parts = address.split(" ");
        if (parts.length >= 3) {
            return parts[0] + " " + parts[1] + " " + parts[2];
        } else if (parts.length >= 2) {
            return parts[0] + " " + parts[1];
        }
        return address;
    }

    // 랜덤 거리 생성
    private String generateRandomDistance() {
        Random random = new Random();
        int distance = random.nextInt(1000) + 100; // 100m ~ 1100m
        return distance + "m";
    }

    // 평점 기반 리뷰 수 생성
    private Integer generateReviewCount(Double rating) {
        if (rating == null) return 0;
        
        Random random = new Random();
        if (rating >= 4.8) return random.nextInt(2000) + 1000; // 1000-3000개
        if (rating >= 4.5) return random.nextInt(1000) + 500;  // 500-1500개
        if (rating >= 4.0) return random.nextInt(500) + 100;   // 100-600개
        return random.nextInt(100) + 10; // 10-110개
    }

    // 카테고리별 최소 주문 금액 생성
    private String generateMinOrder(String category) {
        return switch (category) {
            case "치킨" -> "15,000원";
            case "피자" -> "18,000원";
            case "중식" -> "12,000원";
            case "햄버거" -> "8,000원";
            case "카페" -> "5,000원";
            case "일식" -> "20,000원";
            case "양식" -> "15,000원";
            default -> "10,000원";
        };
    }

    // 카테고리와 음식 종류 기반 설명 생성
    private String generateDescription(String category, String mainFood) {
        String food = mainFood != null ? mainFood : category;
        return food + " 전문점";
    }
}