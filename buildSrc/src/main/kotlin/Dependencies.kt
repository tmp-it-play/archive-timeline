object Dependencies {
    // Spring Boot 기본 스타터 패키지
    const val SPRING_BOOT_STARTER_WEB =
        "org.springframework.boot:spring-boot-starter-web:${DependencyVersion.SPRING_BOOT_VERSION}"
    const val SPRING_BOOT_STARTER_DATA_JPA =
        "org.springframework.boot:spring-boot-starter-data-jpa:${DependencyVersion.SPRING_BOOT_VERSION}"
    const val SPRING_BOOT_STARTER_VALIDATION =
        "org.springframework.boot:spring-boot-starter-validation:${DependencyVersion.SPRING_BOOT_VERSION}"

    // 개발 도구 및 유틸리티
    const val SPRING_BOOT_DEVTOOLS =
        "org.springframework.boot:spring-boot-devtools:${DependencyVersion.SPRING_BOOT_DEVTOOLS_VERSION}"

    // AOP 관련 라이브러리
    const val SPRING_BOOT_STARTER_AOP =
        "org.springframework.boot:spring-boot-starter-aop:${DependencyVersion.SPRING_BOOT_VERSION}"
    const val ASPECTJ_WEAVER = "org.aspectj:aspectjweaver:${DependencyVersion.ASPECTJ_WEAVER_VERSION}"

    // JSON 처리 관련 라이브러리
    const val JACKSON_MODULE_KOTLIN =
        "com.fasterxml.jackson.module:jackson-module-kotlin:${DependencyVersion.JACKSON_VERSION}"

    // Kotlin 관련 라이브러리
    const val KOTLIN_REFLECT = "org.jetbrains.kotlin:kotlin-reflect:${DependencyVersion.KOTLIN_REFLECT_VERSION}"

    // 데이터베이스 관련 라이브러리
    const val MYSQL_CONNECTOR_J = "com.mysql:mysql-connector-j:${DependencyVersion.MYSQL_CONNECTOR_J_VERSION}"

    // 테스트 관련 라이브러리
    const val SPRING_BOOT_STARTER_TEST =
        "org.springframework.boot:spring-boot-starter-test:${DependencyVersion.SPRING_BOOT_STARTER_TEST_VERSION}"
    const val KOTLIN_TEST_JUNIT5 = "org.jetbrains.kotlin:kotlin-test-junit5:${DependencyVersion.KOTLIN_TEST_JUNIT5_VERSION}"
    const val JUNIT_PLATFORM_LAUNCHER =
        "org.junit.platform:junit-platform-launcher:${DependencyVersion.JUNIT_PLATFORM_VERSION}"
}