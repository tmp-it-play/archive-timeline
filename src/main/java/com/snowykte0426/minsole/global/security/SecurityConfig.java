package com.snowykte0426.minsole.global.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.user.name:admin}")
    private String adminUsername;
    
    @Value("${spring.security.user.password:secure_password_2024!}")
    private String adminPassword;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // CSRF 비활성화 (REST API용)
                .csrf(AbstractHttpConfigurer::disable)
                
                // 권한 설정
                .authorizeHttpRequests(authorize -> authorize
                    // 공개 API 엔드포인트
                    .requestMatchers(
                        "/api/v1/search/**",
                        "/api/v1/auth/**",
                        "/health",
                        "/actuator/health",
                        "/actuator/info"
                    ).permitAll()
                    
                    // 정적 리소스
                    .requestMatchers(
                        "/css/**", 
                        "/js/**", 
                        "/images/**", 
                        "/favicon.ico"
                    ).permitAll()
                    
                    // 관리자 전용 엔드포인트
                    .requestMatchers(
                        "/actuator/**",
                        "/admin/**"
                    ).hasRole("ADMIN")
                    
                    // 나머지는 인증 필요
                    .anyRequest().authenticated()
                )
                
                // 폼 로그인 비활성화
                .formLogin(AbstractHttpConfigurer::disable)
                
                // HTTP Basic 인증 활성화 (관리자용)
                .httpBasic(httpBasic -> httpBasic
                    .realmName("Minsole Admin")
                )
                
                // 세션 관리 (Stateless)
                .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // 기본 보안 헤더 설정 (deprecated 메서드 제거)
                .headers(headers -> headers
                    .defaultsDisabled()
                    .cacheControl(cache -> {})
                )
                
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 오리진
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 자격 증명 허용
        configuration.setAllowCredentials(true);
        
        // 캐시 시간
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder().encode(adminPassword))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin);
    }
}
