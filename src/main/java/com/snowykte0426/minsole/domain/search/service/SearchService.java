package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import com.snowykte0426.minsole.domain.search.dto.request.SearchImageRequest;
import com.snowykte0426.minsole.domain.search.dto.request.SearchLocalRequest;
import com.snowykte0426.minsole.domain.search.dto.response.SearchImageResponse;
import com.snowykte0426.minsole.domain.search.dto.response.SearchLocalResponse;
import com.snowykte0426.minsole.infrastructure.NaverClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final NaverClient naverClient;

    /**
     * 네이버 지역검색 API를 호출하여 로컬 검색 결과 리스트를 가져오고,
     * 각 결과에 대해 이미지 검색 API를 호출하여 이미지 링크 리스트를 추출한 후,
     * 이를 SearchDto에 담아 최종적으로 리스트로 반환합니다.
     *
     * @param query 검색어 (예: "광주" 또는 "광주 맛집")
     * @return SearchDto 객체 리스트
     */
    public List<SearchDto> search(String query) {
        // 검색어 자동 보완: "맛집"이 없으면 추가
        if (!query.contains("맛집")) {
            query += " 맛집";
        }

        // 지역 검색 요청: DTO에 기본 display, start, sort가 설정되어 있음
        SearchLocalRequest localRequest = new SearchLocalRequest();
        localRequest.setQuery(query);

        // 네이버 지역검색 API 호출
        SearchLocalResponse localResponse = naverClient.localSearch(localRequest);
        List<SearchDto> resultList = new ArrayList<>();

        if (localResponse != null && localResponse.getTotal() > 0) {
            // 로컬 검색 결과의 각 항목을 순회
            for (var localItem : localResponse.getItems()) {
                // 이미지 검색을 위한 쿼리: HTML 태그 제거 후 사용
                String imageQuery = localItem.getTitle().replaceAll("<[^>]*>", "");
                SearchImageRequest imageRequest = new SearchImageRequest();
                imageRequest.setQuery(imageQuery);

                // 네이버 이미지 검색 API 호출
                SearchImageResponse imageResponse = naverClient.imageSearch(imageRequest);
                List<String> imageLinks = new ArrayList<>();
                if (imageResponse != null
                        && imageResponse.getTotal() > 0
                        && imageResponse.getItems() != null
                        && !imageResponse.getItems().isEmpty()) {
                    // 이미지 검색 결과 전체를 순회하며 링크를 추출
                    for (var imageItem : imageResponse.getItems()) {
                        imageLinks.add(imageItem.getLink());
                    }
                }

                // SearchDto 객체 생성 및 값 설정
                SearchDto dto = new SearchDto();
                dto.setTitle(localItem.getTitle());
                dto.setCategory(localItem.getCategory());
                dto.setAddress(localItem.getAddress());
                dto.setReadAddress(localItem.getRoadAddress());
                dto.setHomePageLink(localItem.getLink());
                dto.setImageLinks(imageLinks);

                resultList.add(dto);
            }
        } else {
            log.info("로컬 검색 결과가 없습니다.");
        }

        return resultList;
    }
}