package com.snowykte0426.minsole.domain.mobile.dto.response;

import com.snowykte0426.minsole.domain.restaurant.dto.RestaurantDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteResponse {
    private boolean success;
    private String message;
    private List<RestaurantDto> favorites;
    private Long totalCount;
}
