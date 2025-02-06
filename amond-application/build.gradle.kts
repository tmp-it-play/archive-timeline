repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":amond-domain"))
    implementation(project(":amond-infrastructure"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(17)
}

tasks.getByName<Jar>("jar") {
    enabled = true
}