package com.snowykte0426.minsole.domain.search.service;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import com.snowykte0426.minsole.domain.data.repository.DataJpaRepository;
import com.snowykte0426.minsole.domain.search.dto.DbDataDto;
import com.snowykte0426.minsole.domain.search.dto.SearchDto;
import com.snowykte0426.minsole.domain.search.dto.request.SearchImageRequest;
import com.snowykte0426.minsole.domain.search.dto.request.SearchLocalRequest;
import com.snowykte0426.minsole.domain.search.dto.response.SearchImageResponse;
import com.snowykte0426.minsole.domain.search.dto.response.SearchLocalResponse;
import com.snowykte0426.minsole.infrastructure.NaverClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LegacySearchService {

    private final NaverClient naverClient;
    private final DataJpaRepository dataJpaRepository;

    /**
     * 네이버 지역검색 API를 호출하여 로컬 검색 결과 리스트를 가져오고,
     * 각 결과에 대해 이미지 검색 API를 호출하여 이미지 링크 리스트를 추출한 후,
     * 이를 SearchDto에 담아 최종적으로 리스트로 반환합니다.
     *
     * @param query 검색어 (예: "광주" 또는 "광주 맛집")
     * @return SearchDto 객체 리스트
     */
    public List<SearchDto> search(String query) {
        if (!query.contains("맛집")) {
            query += " 맛집";
        }
        SearchLocalRequest localRequest = new SearchLocalRequest();
        localRequest.setQuery(query);
        SearchLocalResponse localResponse = naverClient.localSearch(localRequest);
        List<SearchDto> resultList = new ArrayList<>();
        if (localResponse != null && localResponse.getTotal() > 0) {
            for (var localItem : localResponse.getItems()) {
                String imageQuery = localItem.getTitle().replaceAll("<[^>]*>", "");
                SearchImageRequest imageRequest = new SearchImageRequest();
                imageRequest.setQuery(imageQuery);
                SearchImageResponse imageResponse = naverClient.imageSearch(imageRequest);
                List<String> imageLinks = new ArrayList<>();
                if (imageResponse != null
                        && imageResponse.getTotal() > 0
                        && imageResponse.getItems() != null
                        && !imageResponse.getItems().isEmpty()) {
                    for (var imageItem : imageResponse.getItems()) {
                        imageLinks.add(imageItem.getLink());
                    }
                }
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

    /**
     * DB에서 검색어에 해당하는 데이터를 검색하여
     * SearchDto 객체 리스트로 반환합니다.
     *
     * @param query 검색어
     * @return SearchDto 객체 리스트
     */
    public List<DbDataDto> searchDb(@RequestParam("query") String query) {
        List<DbDataDto> searchDtoList = new ArrayList<>();
        if (query != null && !query.isEmpty()) {
            List<DataJpaEntity> searchResults = dataJpaRepository.findByBizNameContaining(query);
            for (DataJpaEntity result : searchResults) {
                DbDataDto dto = new DbDataDto();
                dto.setId(result.getId());
                dto.setServiceId(result.getServiceId());
                dto.setOrgCode(result.getOrgCode());
                dto.setManageCode(result.getManageCode());
                dto.setBizName(result.getBizName());
                dto.setPermitNo(result.getPermitNo());
                dto.setRoadAddr(result.getRoadAddr());
                dto.setJibunAddr(result.getJibunAddr());
                dto.setApplyDate(result.getApplyDate());
                dto.setDesignateDate(result.getDesignateDate());
                dto.setFoodType(result.getFoodType());
                dto.setMainFood(result.getMainFood());
                dto.setLastUpdateDate(result.getLastUpdateDate());
                dto.setPhoneNum(result.getPhoneNum());
                dto.setNaverRating(result.getNaverRating());
                searchDtoList.add(dto);
            }
        }
        return searchDtoList;
    }

    public List<SearchDto> crossValidatedSearch(String query) {
        // 1) 네이버 로컬 검색
        List<SearchDto> naverResults = search(query);

        // 2) DB 검색
        List<DbDataDto> dbResults = searchDb(query);

        // 3) 문자열 유사도 비교 준비 (Levenshtein 사용)
        LevenshteinDistance ld = new LevenshteinDistance();
        final double THRESHOLD = 0.88;  // 유사도 임계치 (0 ~ 1)

        // 4) DB 결과를 map으로 빠르게 조회
        Map<Long, DbDataDto> dbById = dbResults.stream()
                .collect(Collectors.toMap(DbDataDto::getId, Function.identity()));

        // 5) 교차검증: naverResults 중에서,
        //    (a) DB의 이름(bizName)과 유사하거나
        //    (b) 도로명주소(roadAddr)가 포함 매칭되는 경우만 필터링
        List<SearchDto> filtered = new ArrayList<>();
        for (SearchDto nv : naverResults) {
            String nvTitle = nv.getTitle().replaceAll("<[^>]*>", "").trim();
            String nvAddr  = nv.getReadAddress() != null ? nv.getReadAddress() : nv.getAddress();

            boolean matchFound = dbResults.stream().anyMatch(db -> {
                // (1) 이름 유사도 (Levenshtein 기반)
                if (db.getBizName() == null) return false;
                int distance = ld.apply(nvTitle, db.getBizName());
                int maxLength = Math.max(nvTitle.length(), db.getBizName().length());
                if (maxLength == 0) return false; // 둘 다 빈 문자열 방지

                double sim = 1.0 - ((double) distance / maxLength);
                if (sim >= THRESHOLD) return true;

                // (2) 주소 포함 매칭
                return nvAddr != null
                        && db.getRoadAddr() != null
                        && (nvAddr.contains(db.getRoadAddr()) || db.getRoadAddr().contains(nvAddr));
            });

            if (matchFound) {
                filtered.add(nv);
            }
        }

        return filtered;
    }
}