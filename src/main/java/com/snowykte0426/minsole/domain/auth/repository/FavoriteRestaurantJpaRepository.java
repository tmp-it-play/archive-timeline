//package com.snowykte0426.minsole.domain.auth.repository;
//
//import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface FavoriteRestaurantJpaRepository extends JpaRepository<FavoriteRestaurantJpaEntity, Long> {
//
//    @Query("SELECT f FROM FavoriteRestaurantJpaEntity f WHERE f.user.id = :userId AND f.restaurant.id = :restaurantId")
//    Optional<FavoriteRestaurantJpaEntity> findByUserIdAndRestaurantId(@Param("userId") Long userId, @Param("restaurantId") Long restaurantId);
//
//    @Query("SELECT f.restaurant FROM FavoriteRestaurantJpaEntity f WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
//    List<DataJpaEntity> findFavoriteRestaurantsByUserId(@Param("userId") Long userId);
//
//    void deleteByUserIdAndRestaurantId(Long userId, Long restaurantId);
//
//    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);
//
//    Long countByUserId(Long userId);
//}
