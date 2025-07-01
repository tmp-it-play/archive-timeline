package com.snowykte0426.minsole.config.security;

import com.snowykte0426.minsole.global.util.CookieUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.oauth2.authorizedRedirectUris}")
    private List<String> authorizedRedirectUris;

    private final TokenProvider tokenProvider;
    private final CookieUtils cookieUtils;

    @Autowired
    public OAuth2AuthenticationSuccessHandler(TokenProvider tokenProvider, CookieUtils cookieUtils) {
        this.tokenProvider = tokenProvider;
        this.cookieUtils = cookieUtils;
        
        // OAuth 로그인 성공 후 프론트엔드 콜백 페이지로 리디렉션
        setDefaultTargetUrl("http://localhost:3000/auth/callback");
        logger.info("기본 리디렉션 URL 설정: http://localhost:3000/auth/callback");
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        // 로그 추가
        logger.info("OAuth 인증 성공! 리디렉션 URL: " + targetUrl);

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        Optional<String> redirectUri = cookieUtils.getCookie(request, "redirect_uri")
                .map(Cookie::getValue);
        
        logger.info("Cookie에서 가져온 redirect_uri: " + redirectUri.orElse("(empty)"));

        // 리디렉션 URI가 없으면 기본 URL 사용 (프론트엔드 콜백 페이지)
        String targetUrl = redirectUri.orElse(getDefaultTargetUrl());
        logger.info("Target URL (인증 전): " + targetUrl);
        
        // 인증된 URI가 아닌 경우 기본 URL로 변경
        if (redirectUri.isPresent() && !isAuthorizedRedirectUri(redirectUri.get())) {
            logger.warn("Unauthorized redirect URI, using default: " + redirectUri.get());
            targetUrl = getDefaultTargetUrl();
        }

        String token = tokenProvider.createToken(authentication);
        logger.info("JWT 토큰 생성 완료");

        // 프론트엔드 콜백 페이지로 JWT 토큰과 함께 리다이렉트
        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", token)
                .build().toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        cookieUtils.deleteCookie(request, response, "redirect_uri");
    }

    private boolean isAuthorizedRedirectUri(String uri) {
        // URI 검증 테스트를 위해 로그 추가
        logger.info("Checking if redirect URI is authorized: " + uri);
        logger.info("Authorized redirect URIs: " + authorizedRedirectUris);
        
        if (authorizedRedirectUris.isEmpty()) {
            return true; // 허가된 URI가 없으면 모든 URI 허용
        }
        
        try {
            URI clientRedirectUri = URI.create(uri);
            
            return authorizedRedirectUris
                    .stream()
                    .anyMatch(authorizedRedirectUri -> {
                        // URL 전체 비교
                        logger.info("Comparing URIs: authorized='" + authorizedRedirectUri + "', redirect='" + uri + "'");
                        
                        return uri.startsWith(authorizedRedirectUri);
                    });
        } catch (Exception e) {
            logger.error("Error parsing redirect URI: " + uri, e);
            return false;
        }
    }
}