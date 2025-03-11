package com.snowykte0426.minsole.domain.search.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SearchDto { // DB에 저장할 내용
    private int index;
    private String title;                   // 음식명, 장소명
    private String category;                // 카테고리
    private String address;                 // 주소
    private String readAddress;             // 도로명
    private String homePageLink;            // 홈페이지 주소
    private List<String> imageLinks;              // 음식, 가게 이미지 주소
    private boolean isVisit;                // 방문 여부
    private int visitCount;                 // 방문 횟수
    private LocalDateTime lastVisitDate;    // 마지막 방문 일자
}