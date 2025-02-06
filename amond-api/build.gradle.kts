plugins {
    id(Plugins.SPRING_BOOT) version PluginVersion.SPRING_BOOT_VERSION
}

group = "com.amond"
version = "0.0.1-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":amond-domain"))
    implementation(project(":amond-infrastructure"))
    implementation(project(":amond-application"))
    implementation(project(":amond-presentation"))
}

tasks.test {
    useJUnitPlatform()
}
tasks.getByName<Jar>("jar") {
    enabled = true
}