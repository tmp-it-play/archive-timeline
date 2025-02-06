plugins {
    id(Plugins.SPRING_BOOT) version PluginVersion.SPRING_BOOT_VERSION
    id(Plugins.SPRING_DEPENDENCY_MANAGEMENT) version PluginVersion.SPRING_DEPENDENCY_MANAGEMENT_VERSION
    id(Plugins.KOTLIN_SPRING) version PluginVersion.KOTLIN_SPRING_VERSION
    id(Plugins.KOTLIN_JPA) version PluginVersion.KOTLIN_JPA_VERSION
}

repositories {
    mavenCentral()
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

dependencies {
    implementation(project(":amond-domain"))

    implementation(Dependencies.SPRING_BOOT_STARTER_WEB)

    implementation(Dependencies.SPRING_BOOT_STARTER_AOP)
    implementation(Dependencies.ASPECTJ_WEAVER)

    implementation(Dependencies.SPRING_BOOT_STARTER_DATA_JPA)
    implementation(Dependencies.MYSQL_CONNECTOR_J)

    implementation(Dependencies.SPRING_BOOT_STARTER_ACTUATOR)

    implementation(Dependencies.JACKSON_MODULE_KOTLIN)
    implementation(Dependencies.KOTLIN_REFLECT)

    implementation(Dependencies.SPRING_BOOT_STARTER_VALIDATION)

    implementation(Dependencies.SPRING_BOOT_STARTER_TEST)
    implementation(Dependencies.KOTLIN_TEST_JUNIT5)
}

tasks.getByName<Jar>("jar") {
    enabled = true
}

tasks.getByName<Jar>("bootJar") {
    enabled = false
}