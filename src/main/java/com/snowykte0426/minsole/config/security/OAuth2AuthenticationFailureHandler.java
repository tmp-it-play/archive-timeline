package com.snowykte0426.minsole.config.security;

import com.snowykte0426.minsole.global.util.CookieUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final CookieUtils cookieUtils;

    @Autowired
    public OAuth2AuthenticationFailureHandler(CookieUtils cookieUtils) {
        this.cookieUtils = cookieUtils;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // 실패 시에도 프론트엔드 콜백 페이지로 리다이렉트
        String targetUrl = cookieUtils.getCookie(request, "redirect_uri")
                .map(Cookie::getValue)
                .orElse("http://localhost:3000/auth/callback");

        // 에러 메시지와 함께 프론트엔드로 리다이렉트
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();

        logger.error("OAuth 인증 실패: " + exception.getMessage());
        logger.info("에러와 함께 리다이렉트: " + targetUrl);

        cookieUtils.deleteCookie(request, response, "redirect_uri");

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}