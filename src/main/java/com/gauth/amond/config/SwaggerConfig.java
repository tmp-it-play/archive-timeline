package com.gauth.amond.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi roleApi() {
        return GroupedOpenApi.builder().group("roles").pathsToMatch("/role/**").packagesToScan("com.gauth.amond.controller").build();
    }

    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder().group("auth").pathsToMatch("/auth/**").packagesToScan("com.gauth.amond.controller").build();
    }
}
