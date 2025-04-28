package com.snowykte0426.minsole.domain.search.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SearchDto {
    private int index;
    private String title;        // 음식명, 장소명
    private String category;     // 카테고리
    private String address;      // 주소
    private String readAddress;  // 도로명
    private String homePageLink; // 홈페이지 주소
    private List<String> imageLinks;
    private boolean isVisit;
    private int visitCount;
    private LocalDateTime lastVisitDate;
    private Double naverRating;  // ★ 추가
}