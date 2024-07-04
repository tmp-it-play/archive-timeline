package com.gauth.amond.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi roleApi() {
        return GroupedOpenApi.builder()
                .group("roles")
                .pathsToMatch("/role/**") // "/role/**" 경로를 설정합니다.
                .packagesToScan("com.gauth.amond.controller") // 패키지 경로를 설정합니다.
                .build();
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("auth")
                .pathsToMatch("/auth/**") // "/auth/**" 경로를 설정합니다.
                .packagesToScan("com.gauth.amond.controller") // 패키지 경로를 설정합니다.
                .build();
    }
}
