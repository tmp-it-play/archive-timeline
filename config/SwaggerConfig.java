package com.example.riotdo.REST_Board.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder().group("users").pathsToMatch("/users/**", "/auth/**").packagesToScan("com.example.riotdo.REST_Board.controller").build();
    }

    @Bean
    public GroupedOpenApi boardApi() {
        return GroupedOpenApi.builder().group("boards").pathsToMatch("/boards/**").packagesToScan("com.example.riotdo.REST_Board.controller").build();
    }
}