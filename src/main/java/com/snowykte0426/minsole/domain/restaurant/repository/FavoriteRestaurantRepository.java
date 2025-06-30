package com.snowykte0426.minsole.domain.restaurant.repository;

import com.snowykte0426.minsole.domain.auth.entity.User;
import com.snowykte0426.minsole.domain.restaurant.entity.FavoriteRestaurantEntity;
import com.snowykte0426.minsole.domain.restaurant.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRestaurantRepository extends JpaRepository<FavoriteRestaurantEntity, Long> {
    
    List<FavoriteRestaurantEntity> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<FavoriteRestaurantEntity> findByUserAndRestaurant(User user, RestaurantEntity restaurant);
    
    boolean existsByUserAndRestaurant(User user, RestaurantEntity restaurant);
    
    void deleteByUserAndRestaurant(User user, RestaurantEntity restaurant);
    
    @Query("SELECT f.restaurant FROM FavoriteRestaurantEntity f WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
    List<RestaurantEntity> findFavoriteRestaurantsByUserId(@Param("userId") Long userId);
}
