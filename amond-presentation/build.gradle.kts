plugins {
    id(Plugins.SPRING_BOOT) version PluginVersion.SPRING_BOOT_VERSION
    id(Plugins.SPRING_DEPENDENCY_MANAGEMENT) version PluginVersion.SPRING_DEPENDENCY_MANAGEMENT_VERSION
    id(Plugins.KOTLIN_SPRING) version PluginVersion.KOTLIN_SPRING_VERSION
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(Dependencies.SPRING_BOOT_STARTER_WEB)

    implementation(Dependencies.JACKSON_MODULE_KOTLIN)
    implementation(Dependencies.KOTLIN_REFLECT)

    implementation(Dependencies.SPRING_BOOT_STARTER_VALIDATION)

    implementation(Dependencies.SPRING_BOOT_STARTER_TEST)
    implementation(Dependencies.KOTLIN_TEST_JUNIT5)
}

tasks.getByName<Jar>("bootJar") {
    enabled = false
}