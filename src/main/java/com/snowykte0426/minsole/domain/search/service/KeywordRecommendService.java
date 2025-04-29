package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import com.snowykte0426.minsole.domain.search.dto.RecommendResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeywordRecommendService {

    private final DataJpaRepository repository;

    public RecommendResponse recommend(String text, int limit) {
        if (text == null || text.isBlank()) {
            return new RecommendResponse(Collections.emptyList());
        }

        // 1) Use a Pattern to pull out “words” (letters, digits, including 한글)
        Pattern word = Pattern.compile("[\\p{IsLetter}\\p{IsDigit}]{2,}");
        Matcher m = word.matcher(text);

        // 2) Collect unique tokens, drop stopwords
        Set<String> stopwords = Set.of("맛집","추천","검색","음식");
        LinkedHashSet<String> tokens = new LinkedHashSet<>();
        while (m.find()) {
            String tok = m.group().trim();
            if (!stopwords.contains(tok)) {
                tokens.add(tok);
            }
        }

        // 3) Now query the DB
        LinkedHashMap<Long, SearchDto> result = new LinkedHashMap<>();
        for (String kw : tokens) {
            List<DataJpaEntity> list = repository
                    .findByBizNameContainingIgnoreCaseOrMainFoodContainingIgnoreCase(
                            kw, kw, PageRequest.of(0, limit)
                    );
            for (DataJpaEntity ent : list) {
                if (result.size() >= limit) break;
                result.computeIfAbsent(ent.getId(), id -> SearchDto.builder()
                        .index(result.size() + 1)
                        .title(ent.getBizName())
                        .category(ent.getFoodType())
                        .address(ent.getJibunAddr())
                        .readAddress(ent.getRoadAddr())
                        .homePageLink(null)
                        .imageLinks(Collections.emptyList())
                        .isVisit(false)
                        .visitCount(0)
                        .lastVisitDate(null)
                        .naverRating(ent.getNaverRating())
                        .build()
                );
            }
            if (result.size() >= limit) break;
        }

        return new RecommendResponse(new ArrayList<>(result.values()));
    }
}