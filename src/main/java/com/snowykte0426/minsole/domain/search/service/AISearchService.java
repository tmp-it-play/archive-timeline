package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.search.service.util.AIFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AISearchService {
    private final AIFeignClient client;

    public List<String> fetchKeywords(int limit) {
        return client.getKeywords(limit).getKeywords();
    }

    public List<AIFeignClient.RestaurantDto> recommend(String keyword) {
        return client.recommend(new AIFeignClient.RecommendRequest(keyword));
    }
}