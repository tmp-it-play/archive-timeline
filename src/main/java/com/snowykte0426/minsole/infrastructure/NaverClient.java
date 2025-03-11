package com.snowykte0426.minsole.infrastructure;

import com.snowykte0426.minsole.domain.search.dto.request.SearchImageRequest;
import com.snowykte0426.minsole.domain.search.dto.request.SearchLocalRequest;
import com.snowykte0426.minsole.domain.search.dto.response.SearchImageResponse;
import com.snowykte0426.minsole.domain.search.dto.response.SearchLocalResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class NaverClient {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    @Value("${naver.url.search.image}")
    private String searchImageURL;

    @Value("${naver.url.search.local}")
    private String searchLocalURL;

    public SearchLocalResponse localSearch(SearchLocalRequest request) {
        var uri = UriComponentsBuilder
                .fromUriString(searchLocalURL)
                .queryParams(request.toMultiValueMap())
                .build()
                .encode()
                .toUri();

        var headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        var httpEntity = new HttpEntity<>(headers);
        var responseType = new ParameterizedTypeReference<SearchLocalResponse>() {
        };


        var responseEntity = new RestTemplate()
                .exchange(
                        uri,
                        HttpMethod.GET,
                        httpEntity,
                        responseType
                );

        return responseEntity.getBody();
    }

    public SearchImageResponse imageSearch(SearchImageRequest request) {
        var uri = UriComponentsBuilder
                .fromUriString(searchImageURL)
                .queryParams(request.toMultiValueMap())
                .build()
                .encode()
                .toUri();

        var headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        var httpEntity = new HttpEntity<>(headers);
        var responseType = new ParameterizedTypeReference<SearchImageResponse>() {
        };

        var responseEntity = new RestTemplate()
                .exchange(
                        uri,
                        HttpMethod.GET,
                        httpEntity,
                        responseType
                );
        // get body를 로깅해야함-> 포맷팅해서 예쁘게
        log.info("responseEntity.getBody() = {}", responseEntity.getBody());
        return responseEntity.getBody();
    }
}