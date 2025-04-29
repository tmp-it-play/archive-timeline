package com.snowykte0426.minsole.domain.search.service.util;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import java.util.List;

@FeignClient(name = "ai-service", url = "${ai.service.url}")
public interface AIFeignClient {

    @GetMapping("/ai/keywords")
    KeywordResponse getKeywords(@RequestParam("limit") int limit);

    @PostMapping(value = "/ai/recommend", consumes = "application/json")
    List<RestaurantDto> recommend(@RequestBody RecommendRequest request);

    @Data
    class RecommendRequest {
        private String keyword;
        public RecommendRequest(String keyword) { this.keyword = keyword; }
    }

    @Data
    class KeywordResponse {
        private List<String> keywords;
    }

    @Data
    class RecommendItem {
        private String title;
        private String address;
        private String readAddress;
        private List<String> imageLinks;
    }


    @Data
    class RestaurantDto {
        private String title;
        private String address;
        private String readAddress;
        private List<String> imageLinks;
    }
}