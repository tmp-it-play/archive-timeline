package com.snowykte0426.eventsourcing.presentation.user

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.server.coRouter

@Configuration
class UserRouter {

    @Bean
    fun routes(userHandler: UserHandler) = coRouter {
        POST("/users/register", userHandler::registerUser)
        GET("/users/{id}", userHandler::getUser)
    }
}