import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    java
    id("org.springframework.boot") version PluginVersion.SPRING_BOOT
    id("io.spring.dependency-management") version PluginVersion.SPRING_DEPENDENCY_MANAGEMENT
    kotlin("jvm") version PluginVersion.KOTLIN_JVM
    kotlin("plugin.spring") version PluginVersion.KOTLIN_SPRING
}

group = "com.the-moment"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    // Spring 의존성
    implementation(Dependencies.SPRING_JPA)
    implementation(Dependencies.SPRING_WEB)
    implementation(Dependencies.SPRING_AOP)

    // AspectJ (필요 시만 유지)
    implementation(Dependencies.ASPECTJ)

    // 개발 전용
    developmentOnly(Dependencies.SPRING_DEVTOOLS)

    // Database
    implementation(Dependencies.JDBC)
    implementation(Dependencies.MYSQL)
    implementation(Dependencies.REDIS)

    // Lombok
    implementation(Dependencies.LOMBOK)
    annotationProcessor(Dependencies.LOMBOK)

    // 테스트 의존성
    testImplementation(Dependencies.SPRING_TEST)
    testImplementation(Dependencies.JUNIT)
    testImplementation(Dependencies.MOCKITO_JUNIT)
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xjsr305=strict"
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}