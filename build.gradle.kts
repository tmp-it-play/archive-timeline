plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	id("org.springframework.boot") version "3.3.3"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "com.nextech"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// Spring Boot Starter for JDBC (Optional, if you need JDBC directly)
	implementation("org.springframework.boot:spring-boot-starter-jdbc")

	// Spring Boot Starter for building web, including RESTful APIs
	implementation("org.springframework.boot:spring-boot-starter-web")

	// Jackson module for Kotlin support
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

	// Kotlin reflection library
	implementation("org.jetbrains.kotlin:kotlin-reflect")

	// AWS S3 SDK
	implementation("com.amazonaws:aws-java-sdk-s3:1.12.691")

	// Spring Boot Starter for JPA (for database interaction)
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")

	// Spring Boot Starter for Thymeleaf (for rendering HTML views)
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
	testImplementation("org.springframework.security:spring-security-test")

	// Spring Boot DevTools (for hot reloading during development)
	developmentOnly("org.springframework.boot:spring-boot-devtools")

	// MariaDB JDBC Driver (for interacting with MariaDB database)
	runtimeOnly("org.mariadb.jdbc:mariadb-java-client")

	// H2 Database (for in-memory database, useful for testing)
	runtimeOnly("com.h2database:h2")

	// Spring Boot Starter for Testing (JUnit 5 included)
	testImplementation("org.springframework.boot:spring-boot-starter-test") {
		exclude(group = "org.mockito", module = "mockito-core")
	}

	// Mockito for mocking in tests
	testImplementation("org.mockito:mockito-core")

	// Kotlin test library with JUnit 5 integration
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")

	// JUnit Platform Launcher (useful for running tests in certain environments)
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}


kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
