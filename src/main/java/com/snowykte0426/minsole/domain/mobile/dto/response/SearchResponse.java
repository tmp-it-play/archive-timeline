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
public class SearchResponse {
    private boolean success;
    private String message;
    private String query;                      // 검색어
    private List<RestaurantDto> restaurants;   // 검색된 맛집 목록
    private List<String> suggestions;          // 자동완성 제안
    private List<String> popularKeywords;      // 인기 검색어
    private List<String> recentSearches;       // 최근 검색어
    private Long totalCount;                   // 전체 검색 결과 수
    private Integer resultCount;               // 현재 페이지 결과 수
}
