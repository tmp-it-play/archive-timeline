package com.snowykte0426.minsole.domain.restaurant.dto;

import com.snowykte0426.minsole.domain.restaurant.entity.RestaurantEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RestaurantResponseDto {
    private Long id;
    private String name;
    private String address;
    private String roadAddress;
    private String phoneNumber;
    private String category;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private Integer minOrderPrice;
    private Boolean isBlueRibbon;
    private Boolean isFavorite;
    private String distance;

    public static RestaurantResponseDto fromEntity(RestaurantEntity entity) {
        return RestaurantResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .roadAddress(entity.getRoadAddress())
                .phoneNumber(entity.getPhoneNumber())
                .category(entity.getCategory())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .rating(entity.getRating())
                .reviewCount(entity.getReviewCount())
                .imageUrl(entity.getImageUrl())
                .minOrderPrice(entity.getMinOrderPrice())
                .isBlueRibbon(entity.getIsBlueRibbon())
                .build();
    }

    public static RestaurantResponseDto fromEntity(RestaurantEntity entity, boolean isFavorite, String distance) {
        return RestaurantResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .roadAddress(entity.getRoadAddress())
                .phoneNumber(entity.getPhoneNumber())
                .category(entity.getCategory())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .rating(entity.getRating())
                .reviewCount(entity.getReviewCount())
                .imageUrl(entity.getImageUrl())
                .minOrderPrice(entity.getMinOrderPrice())
                .isBlueRibbon(entity.getIsBlueRibbon())
                .isFavorite(isFavorite)
                .distance(distance)
                .build();
    }
}
