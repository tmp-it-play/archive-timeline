package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.search.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final LegacySearchService legacy;       // 기존 Local/Cross/DB 검색 로직
    private final DataJpaRepository repository;     // AI 추천용
    private final KeywordRecommendService recommendService;

    // 일반/교차 검색
    public SearchResponse<SearchDto> searchLocalCross(String type, String query, String category) {
        List<SearchDto> all = "cross".equals(type)
                ? legacy.crossValidatedSearch(query)
                : legacy.search(query);

        // 서버 사이드 카테고리 필터
        List<SearchDto> filtered = all.stream()
                .filter(d -> category == null || category.isEmpty() || category.equals(d.getCategory()))
                .collect(Collectors.toList());

        // Facet 생성
        List<String> cats = filtered.stream()
                .map(SearchDto::getCategory)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return new SearchResponse<>(filtered, new Facets(cats));
    }

    // DB 검색
    public SearchResponse<DbDataDto> searchDb(String query, String category, Double minRating) {
        // 1) DB 조회 (원래 legacy.searchDb(query) 가 DbDataDto 리스트를 반환하도록 수정)
        List<DbDataDto> all = legacy.searchDb(query);

        // 2) 서버 사이드 필터
        List<DbDataDto> filtered = all.stream()
                .filter(d -> category == null || category.isEmpty() || category.equals(d.getFoodType()))
                .filter(d -> minRating == null || (d.getNaverRating() != null && d.getNaverRating() >= minRating))
                .collect(Collectors.toList());

        // 3) Facet 생성 (foodType 기준)
        List<String> cats = filtered.stream()
                .map(DbDataDto::getFoodType)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        return new SearchResponse<>(filtered, new Facets(cats));
    }

    // AI 키워드 추천
    public RecommendResponse recommend(String text, int limit) {
        // recommendService.recommend() 이미 SearchResponse<SearchDto> 를 반환하도록 변경하세요.
        return recommendService.recommend(text, limit);
    }
}