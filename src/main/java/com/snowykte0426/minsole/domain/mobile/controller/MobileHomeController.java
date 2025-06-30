package com.snowykte0426.minsole.domain.mobile.controller;

import com.snowykte0426.minsole.domain.mobile.dto.response.HomeDataResponse;
import com.snowykte0426.minsole.domain.mobile.service.MobileHomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mobile/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MobileHomeController {

    private final MobileHomeService mobileHomeService;

    /**
     * 모바일 홈 화면 데이터 조회
     * Figma 디자인의 메인 홈 화면에 필요한 모든 데이터를 반환
     */
    @GetMapping
    public ResponseEntity<HomeDataResponse> getHomeData(
            @RequestParam(required = false, defaultValue = "광주 광산구") String location) {
        HomeDataResponse homeData = mobileHomeService.getHomeData(location);
        return ResponseEntity.ok(homeData);
    }

    /**
     * 카테고리별 맛집 조회
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<HomeDataResponse.RestaurantSection> getRestaurantsByCategory(
            @PathVariable String category,
            @RequestParam(required = false, defaultValue = "광주 광산구") String location) {
        HomeDataResponse.RestaurantSection section = mobileHomeService.getRestaurantsByCategory(category, location);
        return ResponseEntity.ok(section);
    }
}
