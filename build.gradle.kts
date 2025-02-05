plugins {
	id(Plugins.KOTLIN_JVM) version PluginVersion.KOTLIN_JVM_VERSION
}

subprojects {
	apply(plugin = Plugins.KOTLIN_JVM)
	apply(plugin = Plugins.KAPT)

	dependencies {
		implementation(Dependencies.SPRING_BOOT_STARTER_WEB)
		implementation(Dependencies.SPRING_BOOT_STARTER_DATA_JPA)
		implementation(Dependencies.SPRING_BOOT_STARTER_VALIDATION)
		implementation(Dependencies.SPRING_BOOT_STARTER_AOP)
		implementation(Dependencies.SPRING_BOOT_STARTER_TEST)
		implementation(Dependencies.SPRING_BOOT_DEVTOOLS)
		implementation(Dependencies.SPRING_BOOT_STARTER_ACTUATOR)
		implementation(Dependencies.ASPECTJ_WEAVER)
		implementation(Dependencies.JACKSON_MODULE_KOTLIN)
		implementation(Dependencies.KOTLIN_REFLECT)
		implementation(Dependencies.MYSQL_CONNECTOR_J)
		testImplementation(Dependencies.KOTLIN_TEST_JUNIT5)
		testRuntimeOnly(Dependencies.JUNIT_PLATFORM_LAUNCHER)
	}
}

allprojects {
	group = "com.amond"
	version = "0.0.1-SNAPSHOT"
	java.sourceCompatibility = JavaVersion.VERSION_17

	tasks {
		compileKotlin {
			compilerOptions {
				freeCompilerArgs.add("-Xjsr305=strict")
				jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
			}
		}
		compileJava {
			sourceCompatibility = JavaVersion.VERSION_17.majorVersion
		}
		test {
			useJUnitPlatform()
		}
	}

	repositories {
		mavenCentral()
		maven("https://jitpack.io")
	}
}