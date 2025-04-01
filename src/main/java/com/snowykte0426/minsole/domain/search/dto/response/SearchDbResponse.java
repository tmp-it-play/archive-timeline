package com.snowykte0426.minsole.domain.search.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchDbResponse {
    private Long id;
    private String serviceId;
    private String orgCode;
    private String manageCode;
    private String bizName;
    private String permitNo;
    private String permitType;
    private String roadAddr;
    private String jibunAddr;
    private LocalDate applyDate;
    private LocalDate designateDate;
    private String foodType;
    private String mainFood;
    private LocalDateTime lastUpdateDate;
    private String phoneNum;

    @Builder
    public SearchDbResponse(Long id, String serviceId, String orgCode, String manageCode, String bizName, String permitNo, String roadAddr, String jibunAddr, LocalDate applyDate, LocalDate designateDate, String foodType, String mainFood, LocalDateTime lastUpdateDate, String phoneNum) {
        this.id = id;
        this.serviceId = serviceId;
        this.orgCode = orgCode;
        this.manageCode = manageCode;
        this.bizName = bizName;
        this.permitNo = permitNo;
        this.roadAddr = roadAddr;
        this.jibunAddr = jibunAddr;
        this.applyDate = applyDate;
        this.designateDate = designateDate;
        this.foodType = foodType;
        this.mainFood = mainFood;
        this.lastUpdateDate = lastUpdateDate;
        this.phoneNum = phoneNum;
    }
}