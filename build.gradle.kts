plugins {
	id(Plugins.KOTLIN_JVM) version PluginVersion.KOTLIN_JVM_VERSION
	id(Plugins.KOTLIN_SPRING) version PluginVersion.KOTLIN_SPRING_VERSION
	id(Plugins.SPRING_BOOT) version PluginVersion.SPRING_BOOT_VERSION
	id(Plugins.SPRING_DEPENDENCY_MANAGEMENT) version PluginVersion.SPRING_DEPENDENCY_MANAGEMENT_VERSION
	id(Plugins.KOTLIN_JPA) version PluginVersion.KOTLIN_JPA_VERSION
	id(Plugins.KAPT) version PluginVersion.KAPT_VERSION
}

group = "com.amond"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

subprojects{
	apply {
		plugin(Plugins.KOTLIN_JVM)
		version= PluginVersion.KOTLIN_JVM_VERSION
	}
	apply {
		plugin(Plugins.KOTLIN_SPRING)
		version= PluginVersion.KOTLIN_SPRING_VERSION
	}
	dependencies{
		implementation(Dependencies.SPRING_BOOT_STARTER_WEB)
		implementation(Dependencies.SPRING_BOOT_STARTER_DATA_JPA)
		implementation(Dependencies.SPRING_BOOT_STARTER_VALIDATION)
		implementation(Dependencies.SPRING_BOOT_STARTER_AOP)
		implementation(Dependencies.SPRING_BOOT_STARTER_TEST)
		developmentOnly(Dependencies.SPRING_BOOT_DEVTOOLS)

		implementation(Dependencies.ASPECTJ_WEAVER)

		implementation(Dependencies.JACKSON_MODULE_KOTLIN)
		implementation(Dependencies.KOTLIN_REFLECT)

		implementation(Dependencies.MYSQL_CONNECTOR_J)

		implementation(Dependencies.KOTLIN_TEST_JUNIT5)
		testRuntimeOnly(Dependencies.JUNIT_PLATFORM_LAUNCHER)
	}
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.mysql:mysql-connector-j")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
