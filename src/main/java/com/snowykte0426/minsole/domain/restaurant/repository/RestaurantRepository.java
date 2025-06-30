package com.snowykte0426.minsole.domain.restaurant.repository;

import com.snowykte0426.minsole.domain.restaurant.entity.RestaurantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantEntity, Long> {
    
    List<RestaurantEntity> findTop10ByOrderByRatingDesc();
    
    List<RestaurantEntity> findByIsBlueRibbonTrue();
    
    @Query("SELECT r FROM RestaurantEntity r WHERE " +
           "(:latitude IS NULL OR " +
           "6371 * acos(cos(radians(:latitude)) * cos(radians(r.latitude)) * cos(radians(r.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(r.latitude))) < :distance)")
    List<RestaurantEntity> findNearbyRestaurants(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("distance") Double distanceInKm);
    
    @Query("SELECT r FROM RestaurantEntity r WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.category) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<RestaurantEntity> searchRestaurants(@Param("keyword") String keyword);
}
