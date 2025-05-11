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
    maven { url = uri("https://oss.sonatype.org/content/repositories/releases/") }
}

dependencies {
    /* Spring Boot */
    implementation(Dependencies.SPRING_JPA)
    implementation(Dependencies.SPRING_WEB)
    implementation(Dependencies.SPRING_AOP)
    implementation(Dependencies.SPRING_JSON)

    /* AspectJ */
    implementation(Dependencies.ASPECTJ)

    /* NLP */
    implementation(Dependencies.APACHE_LANG3)
    implementation(Dependencies.DEEPLEARNING4J_NLP)

    /* Spring Boot DevTools */
    developmentOnly(Dependencies.SPRING_DEVTOOLS)

    /* Database */
    implementation(Dependencies.JDBC)
    implementation(Dependencies.MYSQL)
    implementation(Dependencies.MARIA_DB)
    implementation(Dependencies.REDIS)

    /* Lombok */
    implementation(Dependencies.LOMBOK)
    annotationProcessor(Dependencies.LOMBOK)

    /* Test */
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

tasks.withType<Jar> {
    archiveBaseName.set("application")
    archiveVersion.set("1.0.0")
}

tasks.withType<Test> {
    useJUnitPlatform()
}