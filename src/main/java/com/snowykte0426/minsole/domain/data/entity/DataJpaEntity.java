package com.snowykte0426.minsole.domain.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "data")
@Getter
@NoArgsConstructor
public class DataJpaEntity {
    @Id
    @Column(name = "data_id")
    private Long id;

    // 개방서비스 ID
    @Column(name = "service_id")
    private String serviceId;

    // 개방자치단체 코드
    @Column(name = "org_code")
    private String orgCode;

    // 관리번호
    @Column(name = "manage_code")
    private String manageCode;

    // 업소명
    @Column(name = "biz_name")
    private String bizName;

    // 인허가번호
    @Column(name = "permit_no")
    private String permitNo;

    // 도로명주소
    @Column(name = "road_addr")
    private String roadAddr;

    // 소재지주소
    @Column(name = "jibun_addr")
    private String jibunAddr;

    // 신청일자
    @Column(name = "apply_date")
    private LocalDate applyDate;

    // 지정일자
    @Column(name = "designate_date")
    private LocalDate designateDate;

    // 음식의 유형
    @Column(name = "food_type")
    private String foodType;

    // 주된음식종류
    @Column(name = "main_food")
    private String mainFood;

    // 최종수정일자
    @Column(name = "last_update_date")
    private LocalDateTime lastUpdateDate;

    // 전화번호
    @Column(name = "phone_num")
    private String phoneNum;

    // 네이버 평점
    @Column(name = "naver_rating")
    private Double naverRating;

    @Builder
    public DataJpaEntity(Long id, String serviceId, String orgCode, String manageCode, String bizName, String permitNo, String roadAddr, String jibunAddr, LocalDate applyDate, LocalDate designateDate, String foodType, String mainFood, LocalDateTime lastUpdateDate, String phoneNum, Double naverRating) {
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
        this.naverRating = naverRating;
    }
}
