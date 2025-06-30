package com.snowykte0426.minsole.domain.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
    private Long id;
    private String name;
    private String distance;
    private String location;
    private Double rating;
    private Integer reviews;
    private String minOrder;
    private String image;
    private String category;
    private String phone;
    private String address;
    private String description;
    private String operatingHours;
    private Double latitude;
    private Double longitude;
    private Boolean isFavorite;
    private Boolean isBlueRibbon;
}