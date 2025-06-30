package com.snowykte0426.minsole.domain.mobile.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeDataResponse {
    
    // 카테고리 섹션
    private List<CategoryItem> categories;
    
    // 오늘의 우리동네 추천
    private RestaurantSection todayRecommendation;
    
    // 나의 또간집 (즐겨찾기)
    private RestaurantSection favorites;
    
    // 오늘의 블루리본 추천
    private RestaurantSection blueRibbon;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryItem {
        private String name;        // 카테고리 이름 (한식, 중식, 일식 등)
        private String emoji;       // 이모지 아이콘
        private String key;         // API 호출용 키
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestaurantSection {
        private String title;       // 섹션 제목
        private List<RestaurantCard> restaurants;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestaurantCard {
        private Long id;
        private String name;        // 업소명
        private String image;       // 이미지 또는 이모지
        private String distance;    // 거리 (450m)
        private String location;    // 위치 (광주 광산구 소촌동)
        private Double rating;      // 평점 (4.9)
        private Integer reviewCount; // 리뷰 수 (600)
        private String reviewText;  // 리뷰 텍스트 (4.9 (600))
        private String minOrder;    // 최소 주문 금액 (최소 주문: 13,000원)
        private String category;    // 카테고리
        private Boolean isBlueRibbon; // 블루리본 여부
    }
}
