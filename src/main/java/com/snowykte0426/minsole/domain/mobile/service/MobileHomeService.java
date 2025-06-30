package com.snowykte0426.minsole.domain.mobile.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.mobile.dto.response.HomeDataResponse;
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
public class MobileHomeService {

    private final DataJpaRepository dataJpaRepository;

    // Figma 디자인에 맞는 카테고리 정의
    private static final List<HomeDataResponse.CategoryItem> CATEGORIES = List.of(
        HomeDataResponse.CategoryItem.builder().name("도시락").emoji("🍱").key("lunchbox").build(),
        HomeDataResponse.CategoryItem.builder().name("디저트").emoji("🧁").key("dessert").build(),
        HomeDataResponse.CategoryItem.builder().name("한식").emoji("🍚").key("korean").build(),
        HomeDataResponse.CategoryItem.builder().name("일식").emoji("🍜").key("japanese").build(),
        HomeDataResponse.CategoryItem.builder().name("양식").emoji("🍝").key("western").build(),
        HomeDataResponse.CategoryItem.builder().name("초밥, 회").emoji("🍣").key("sushi").build(),
        HomeDataResponse.CategoryItem.builder().name("아시안").emoji("🥡").key("asian").build(),
        HomeDataResponse.CategoryItem.builder().name("샌드위치").emoji("🥪").key("sandwich").build(),
        HomeDataResponse.CategoryItem.builder().name("샐러드").emoji("🥗").key("salad").build(),
        HomeDataResponse.CategoryItem.builder().name("카페").emoji("☕").key("cafe").build(),
        HomeDataResponse.CategoryItem.builder().name("피자").emoji("🍕").key("pizza").build(),
        HomeDataResponse.CategoryItem.builder().name("치킨").emoji("🍗").key("chicken").build(),
        HomeDataResponse.CategoryItem.builder().name("햄버거").emoji("🍔").key("hamburger").build(),
        HomeDataResponse.CategoryItem.builder().name("빵").emoji("🥐").key("bread").build()
    );

    // 카테고리 매핑
    private static final Map<String, List<String>> CATEGORY_KEYWORDS;
    static {
        Map<String, List<String>> mapping = new HashMap<>();
        mapping.put("lunchbox", List.of("도시락", "분식"));
        mapping.put("dessert", List.of("디저트", "케이크", "아이스크림", "빙수", "팥빙수"));
        mapping.put("korean", List.of("한식", "한정식", "백반", "김치찌개", "된장찌개", "갈비", "삼겹살", "불고기", "비빔밥", "냉면"));
        mapping.put("japanese", List.of("일식", "일본음식", "라멘", "우동", "카츠", "돈카츠"));
        mapping.put("western", List.of("양식", "서양음식", "스테이크", "파스타", "리조또"));
        mapping.put("sushi", List.of("초밥", "사시미", "회", "참치", "연어"));
        mapping.put("asian", List.of("중식", "중국음식", "짜장면", "짬뽕", "탕수육", "마파두부", "양장피", "태국", "베트남", "인도"));
        mapping.put("sandwich", List.of("샌드위치", "토스트"));
        mapping.put("salad", List.of("샐러드"));
        mapping.put("cafe", List.of("카페", "커피", "음료"));
        mapping.put("pizza", List.of("피자"));
        mapping.put("chicken", List.of("치킨", "닭", "프라이드치킨", "양념치킨", "후라이드"));
        mapping.put("hamburger", List.of("햄버거", "버거"));
        mapping.put("bread", List.of("빵", "베이커리", "제과"));
        CATEGORY_KEYWORDS = Collections.unmodifiableMap(mapping);
    }

    /**
     * 홈 화면 전체 데이터 조회
     */
    public HomeDataResponse getHomeData(String location) {
        try {
            return HomeDataResponse.builder()
                .categories(CATEGORIES)
                .todayRecommendation(getTodayRecommendation(location))
                .favorites(getFavoriteSection(location))
                .blueRibbon(getBlueRibbonSection(location))
                .build();
        } catch (Exception e) {
            log.error("홈 데이터 조회 실패", e);
            return HomeDataResponse.builder()
                .categories(CATEGORIES)
                .todayRecommendation(HomeDataResponse.RestaurantSection.builder()
                    .title("오늘의 우리동네 추천")
                    .restaurants(Collections.emptyList())
                    .build())
                .favorites(HomeDataResponse.RestaurantSection.builder()
                    .title("나의 또간집")
                    .restaurants(Collections.emptyList())
                    .build())
                .blueRibbon(HomeDataResponse.RestaurantSection.builder()
                    .title("오늘의 블루리본 추천")
                    .restaurants(Collections.emptyList())
                    .build())
                .build();
        }
    }

    /**
     * 오늘의 우리동네 추천 (평점 4.5 이상, 거리순)
     */
    private HomeDataResponse.RestaurantSection getTodayRecommendation(String location) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("naverRating").descending());
        List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
        
        List<HomeDataResponse.RestaurantCard> restaurants = entities.stream()
            .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.5)
            .limit(3) // Figma 디자인에서는 3개씩 표시
            .map(this::convertToRestaurantCard)
            .collect(Collectors.toList());

        return HomeDataResponse.RestaurantSection.builder()
            .title("오늘의 우리동네 추천")
            .restaurants(restaurants)
            .build();
    }

    /**
     * 나의 또간집 (즐겨찾기 - 평점 높은 순)
     */
    private HomeDataResponse.RestaurantSection getFavoriteSection(String location) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("naverRating").descending());
        List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
        
        List<HomeDataResponse.RestaurantCard> restaurants = entities.stream()
            .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.3)
            .limit(3)
            .map(this::convertToRestaurantCard)
            .collect(Collectors.toList());

        return HomeDataResponse.RestaurantSection.builder()
            .title("나의 또간집")
            .restaurants(restaurants)
            .build();
    }

    /**
     * 오늘의 블루리본 추천 (평점 4.8 이상 프리미엄)
     */
    private HomeDataResponse.RestaurantSection getBlueRibbonSection(String location) {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("naverRating").descending());
        List<DataJpaEntity> entities = dataJpaRepository.findAll(pageable).getContent();
        
        List<HomeDataResponse.RestaurantCard> restaurants = entities.stream()
            .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() >= 4.8)
            .limit(3)
            .map(entity -> {
                HomeDataResponse.RestaurantCard card = convertToRestaurantCard(entity);
                card.setIsBlueRibbon(true);
                return card;
            })
            .collect(Collectors.toList());

        return HomeDataResponse.RestaurantSection.builder()
            .title("오늘의 블루리본 추천")
            .restaurants(restaurants)
            .build();
    }

    /**
     * 카테고리별 맛집 조회
     */
    public HomeDataResponse.RestaurantSection getRestaurantsByCategory(String categoryKey, String location) {
        try {
            List<String> keywords = CATEGORY_KEYWORDS.getOrDefault(categoryKey, List.of(categoryKey));
            List<DataJpaEntity> entities = new ArrayList<>();
            
            for (String keyword : keywords) {
                Pageable pageable = PageRequest.of(0, 10);
                List<DataJpaEntity> found = dataJpaRepository
                    .findByBizNameContainingIgnoreCaseOrMainFoodContainingIgnoreCase(keyword, keyword, pageable);
                entities.addAll(found);
            }
            
            List<HomeDataResponse.RestaurantCard> restaurants = entities.stream()
                .distinct()
                .filter(entity -> entity.getNaverRating() != null && entity.getNaverRating() > 0)
                .map(this::convertToRestaurantCard)
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(20)
                .collect(Collectors.toList());

            String categoryName = CATEGORIES.stream()
                .filter(cat -> cat.getKey().equals(categoryKey))
                .findFirst()
                .map(HomeDataResponse.CategoryItem::getName)
                .orElse(categoryKey);

            return HomeDataResponse.RestaurantSection.builder()
                .title(categoryName + " 맛집")
                .restaurants(restaurants)
                .build();
                
        } catch (Exception e) {
            log.error("카테고리별 맛집 조회 실패: {}", categoryKey, e);
            return HomeDataResponse.RestaurantSection.builder()
                .title("맛집")
                .restaurants(Collections.emptyList())
                .build();
        }
    }

    /**
     * Entity를 RestaurantCard로 변환
     */
    private HomeDataResponse.RestaurantCard convertToRestaurantCard(DataJpaEntity entity) {
        // 거리 생성 (실제로는 GPS 기반으로 계산)
        String distance = generateRandomDistance();
        
        // 위치 정보 추출
        String location = extractLocationFromAddress(entity.getRoadAddr(), entity.getJibunAddr());
        
        // 리뷰 수 생성
        Integer reviewCount = generateReviewCount(entity.getNaverRating());
        
        // 리뷰 텍스트 생성
        String reviewText = String.format("%.1f (%,d)", 
            entity.getNaverRating() != null ? entity.getNaverRating() : 0.0, reviewCount);
        
        // 카테고리 판단
        String category = determineCategoryFromFood(entity.getMainFood(), entity.getFoodType());
        
        // 최소 주문 금액
        String minOrder = generateMinOrder(category);

        return HomeDataResponse.RestaurantCard.builder()
            .id(entity.getId())
            .name(entity.getBizName())
            .image(getCategoryEmoji(category))
            .distance(distance)
            .location(location)
            .rating(entity.getNaverRating() != null ? entity.getNaverRating() : 0.0)
            .reviewCount(reviewCount)
            .reviewText(reviewText)
            .minOrder(minOrder)
            .category(category)
            .isBlueRibbon(entity.getNaverRating() != null && entity.getNaverRating() >= 4.8)
            .build();
    }

    // 음식 종류에서 카테고리 판단
    private String determineCategoryFromFood(String mainFood, String foodType) {
        if (mainFood == null && foodType == null) return "기타";
        
        String food = (mainFood != null ? mainFood : foodType).toLowerCase();
        
        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORDS.entrySet()) {
            if (entry.getValue().stream().anyMatch(keyword -> food.contains(keyword.toLowerCase()))) {
                return CATEGORIES.stream()
                    .filter(cat -> cat.getKey().equals(entry.getKey()))
                    .findFirst()
                    .map(HomeDataResponse.CategoryItem::getName)
                    .orElse("기타");
            }
        }
        
        return "기타";
    }

    // 카테고리별 이모지 반환
    private String getCategoryEmoji(String category) {
        return CATEGORIES.stream()
            .filter(cat -> cat.getName().equals(category))
            .findFirst()
            .map(HomeDataResponse.CategoryItem::getEmoji)
            .orElse("🍽️");
    }

    // 주소에서 지역 정보 추출
    private String extractLocationFromAddress(String roadAddr, String jibunAddr) {
        String address = roadAddr != null ? roadAddr : jibunAddr;
        if (address == null) return "위치 정보 없음";
        
        String[] parts = address.split(" ");
        if (parts.length >= 3) {
            return parts[0] + " " + parts[1] + " " + parts[2];
        } else if (parts.length >= 2) {
            return parts[0] + " " + parts[1];
        }
        return address;
    }

    // 랜덤 거리 생성 (Figma 디자인 예시: 450m, 454m)
    private String generateRandomDistance() {
        Random random = new Random();
        int distance = random.nextInt(500) + 200; // 200m ~ 700m
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

    // 카테고리별 최소 주문 금액 생성 (Figma 디자인 참고)
    private String generateMinOrder(String category) {
        return switch (category) {
            case "치킨" -> "최소 주문: 18,000원";
            case "피자" -> "최소 주문: 15,000원";
            case "중식", "아시안" -> "최소 주문: 13,000원";
            case "초밥, 회", "일식" -> "최소 주문: 20,000원";
            case "양식" -> "최소 주문: 15,000원";
            case "햄버거" -> "최소 주문: 8,000원";
            case "카페" -> "최소 주문: 5,000원";
            default -> "최소 주문: 10,000원";
        };
    }
}
