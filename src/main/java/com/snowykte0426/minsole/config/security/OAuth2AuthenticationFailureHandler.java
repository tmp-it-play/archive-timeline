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
        String targetUrl = cookieUtils.getCookie(request, "redirect_uri")
                .map(Cookie::getValue)
                .orElse("/");

        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();

        cookieUtils.deleteCookie(request, response, "redirect_uri");

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
