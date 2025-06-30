package com.snowykte0426.minsole.domain.restaurant.entity;

import com.snowykte0426.minsole.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_restaurants", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"user_id", "restaurant_id"})
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FavoriteRestaurantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private RestaurantEntity restaurant;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Builder
    public FavoriteRestaurantEntity(User user, RestaurantEntity restaurant) {
        this.user = user;
        this.restaurant = restaurant;
    }
}
