package com.snowykte0426.minsole.domain.search.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DbDataDto {
    private Long id; // 데이터 ID
    private String serviceId; // 개방서비스 ID
    private String orgCode; // 개방자치단체 코드
    private String manageCode; // 관리번호
    private String bizName; // 업소명
    private String permitNo; // 인허가번호
    private String permitType;  // 인허가 종류
    private String roadAddr; // 도로명주소
    private String jibunAddr; // 소재지주소
    private LocalDate applyDate; // 신청일자
    private LocalDate designateDate; // 지정일자
    private String foodType; // 음식의 유형
    private String mainFood; // 주된 음식
    private LocalDateTime lastUpdateDate; // 마지막 업데이트 일자
    private String phoneNum; // 전화번호
    private Double naverRating; // 네이버 평점
}