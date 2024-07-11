package com.example.riotdo.REST_Board.global;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public GroupedOpenApi boardApi() {
        return GroupedOpenApi.builder().group("boards").pathsToMatch("/boards/**").packagesToScan("com.example.riotdo.REST_Board.domain.boards").build();
    }

    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder().group("users").pathsToMatch("/users/**", "/auth/**").packagesToScan("com.example.riotdo.REST_Board.domain.users").build();
    }
}