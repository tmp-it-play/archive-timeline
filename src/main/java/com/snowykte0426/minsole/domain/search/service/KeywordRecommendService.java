package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeywordRecommendService {

    private final DataJpaRepository dataJpaRepository;

    public List<SearchDto> recommend(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        // 1) 간단 토큰화
        Set<String> tokens = Arrays.stream(text.split("\\W+"))
                .map(String::trim)
                .filter(t -> t.length() > 1)
                .collect(Collectors.toSet());

        // 2) 불용어 제거
        tokens.removeAll(Set.of("맛집", "추천", "검색", "음식"));

        // 3) 결과 집합(최대 20개)
        LinkedHashMap<Long, SearchDto> result = new LinkedHashMap<>();
        for (String kw : tokens) {
            List<DataJpaEntity> list = dataJpaRepository
                    .findByBizNameContainingIgnoreCaseOrMainFoodContainingIgnoreCase(
                            kw, kw, PageRequest.of(0, 10)
                    );

            for (DataJpaEntity ent : list) {
                if (result.size() >= 20) break;
                if (!result.containsKey(ent.getId())) {
                    SearchDto dto = new SearchDto(
                            result.size() + 1,           // index
                            ent.getBizName(),            // title
                            ent.getFoodType(),           // category
                            ent.getJibunAddr(),          // address (지번주소)
                            ent.getRoadAddr(),           // readAddress (도로명주소)
                            null,                        // homePageLink
                            Collections.emptyList(),     // imageLinks
                            false,                       // isVisit
                            0,                           // visitCount
                            null                         // lastVisitDate
                    );
                    result.put(ent.getId(), dto);
                }
            }
            if (result.size() >= 20) break;
        }

        return new ArrayList<>(result.values());
    }
}