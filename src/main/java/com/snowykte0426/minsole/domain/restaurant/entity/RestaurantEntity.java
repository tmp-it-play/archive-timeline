package com.snowykte0426.minsole.domain.restaurant.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurants")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RestaurantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column
    private String roadAddress;

    @Column
    private String phoneNumber;

    @Column
    private String category;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column
    private Double rating;

    @Column
    private Integer reviewCount;

    @Column
    private String imageUrl;

    @Column
    private Integer minOrderPrice;

    @Column
    private Boolean isBlueRibbon;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public RestaurantEntity(String name, String address, String roadAddress, String phoneNumber, 
                           String category, Double latitude, Double longitude, Double rating, 
                           Integer reviewCount, String imageUrl, Integer minOrderPrice, Boolean isBlueRibbon) {
        this.name = name;
        this.address = address;
        this.roadAddress = roadAddress;
        this.phoneNumber = phoneNumber;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.imageUrl = imageUrl;
        this.minOrderPrice = minOrderPrice;
        this.isBlueRibbon = isBlueRibbon != null ? isBlueRibbon : false;
    }
}
