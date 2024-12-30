package com.snowykte0426.myblog.security.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@EnableWebSecurity
@Configuration
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf {
                it.disable()
            }
            .cors {
                it.disable()
            }
            .authorizeHttpRequests { requests ->
                requests.anyRequest().permitAll()
            }
            .formLogin {
                it.disable()
            }
        return http.build()
    }
}
