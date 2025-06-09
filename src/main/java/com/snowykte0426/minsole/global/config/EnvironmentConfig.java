package com.snowykte0426.minsole.global.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

@Slf4j
@Configuration
public class EnvironmentConfig {

    private final Environment environment;

    public EnvironmentConfig(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void loadEnvironmentVariables() {
        // .env 파일 로드
        loadEnvFile();
        
        // 환경변수 확인 로깅
        logEnvironmentStatus();
    }

    private void loadEnvFile() {
        Path envPath = Paths.get(".env");
        
        if (!Files.exists(envPath)) {
            log.warn(".env 파일이 존재하지 않습니다. 환경변수를 직접 설정해주세요.");
            return;
        }

        try {
            Properties envProps = new Properties();
            envProps.load(new FileInputStream(envPath.toFile()));
            
            // 시스템 프로퍼티로 설정 (기존 값이 없는 경우만)
            envProps.forEach((key, value) -> {
                String keyStr = key.toString();
                if (System.getProperty(keyStr) == null && System.getenv(keyStr) == null) {
                    System.setProperty(keyStr, value.toString());
                }
            });
            
            log.info(".env 파일에서 {}개의 환경변수를 로드했습니다.", envProps.size());
            
        } catch (IOException e) {
            log.error(".env 파일 로드 실패", e);
        }
    }

    private void logEnvironmentStatus() {
        log.info("=== 환경변수 설정 상태 ===");
        
        // 네이버 API 설정
        boolean naverConfigured = checkAndLog("NAVER_CLIENT_ID", "네이버 클라이언트 ID") &&
                                checkAndLog("NAVER_CLIENT_SECRET", "네이버 클라이언트 시크릿");
        
        // 데이터베이스 설정
        boolean dbConfigured = checkAndLog("RDB_HOST", "데이터베이스 호스트") &&
                              checkAndLog("RDB_PASSWORD", "데이터베이스 패스워드");
        
        // OpenAI 설정
        boolean openaiConfigured = checkAndLog("OPENAI_API_KEY", "OpenAI API 키");
        
        // Redis 설정
        boolean redisConfigured = checkAndLog("REDIS_HOST", "Redis 호스트") &&
                                 checkAndLog("REDIS_PASSWORD", "Redis 패스워드");
        
        log.info("네이버 API: {}, 데이터베이스: {}, OpenAI: {}, Redis: {}",
            naverConfigured ? "✅" : "❌",
            dbConfigured ? "✅" : "❌", 
            openaiConfigured ? "✅" : "❌",
            redisConfigured ? "✅" : "❌"
        );
        
        if (!naverConfigured || !dbConfigured) {
            log.warn("필수 환경변수가 설정되지 않았습니다. 애플리케이션이 정상 동작하지 않을 수 있습니다.");
        }
    }

    private boolean checkAndLog(String key, String description) {
        String value = getEnvironmentValue(key);
        boolean isConfigured = value != null && !value.trim().isEmpty();
        
        if (isConfigured) {
            // 민감한 정보는 마스킹
            String logValue = isSensitive(key) ? maskValue(value) : value;
            log.debug("{}: {}", description, logValue);
        } else {
            log.warn("{} ({}): 설정되지 않음", description, key);
        }
        
        return isConfigured;
    }

    private String getEnvironmentValue(String key) {
        // 1. 시스템 환경변수 확인
        String value = System.getenv(key);
        if (value != null) {
            return value;
        }
        
        // 2. 시스템 프로퍼티 확인
        value = System.getProperty(key);
        if (value != null) {
            return value;
        }
        
        // 3. Spring 환경변수 확인
        return environment.getProperty(key);
    }

    private boolean isSensitive(String key) {
        return key.contains("PASSWORD") || 
               key.contains("SECRET") || 
               key.contains("KEY") ||
               key.contains("TOKEN");
    }

    private String maskValue(String value) {
        if (value == null || value.length() <= 8) {
            return "****";
        }
        return value.substring(0, 4) + "****" + value.substring(value.length() - 4);
    }
}
