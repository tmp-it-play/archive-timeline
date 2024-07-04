package com.gauth.amond.config;

import dev.yangsijun.gauth.configurer.GAuthLoginConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {
    private final GAuthLoginConfigurer gauth;

    public SecurityConfig(GAuthLoginConfigurer gAuthLoginConfigurer) {
        this.gauth = gAuthLoginConfigurer;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(
                                "/gauth/authorization",
                                "/login/gauth/code",
                                "/swagger-ui/**",      // Swagger UI 경로를 허용
                                "/v3/api-docs/**"      // OpenAPI 문서 경로를 허용
                        ).permitAll()
                        .requestMatchers("/auth/me").authenticated()
                        .requestMatchers("/role/student").hasAuthority("GAUTH_ROLE_STUDENT")
                        .requestMatchers("/role/teacher").hasAuthority("GAUTH_ROLE_TEACHER")
                        .anyRequest().denyAll()
                )
                .logout(withDefaults());
        gauth.configure(http);

        return http.build();
    }
}