plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}
rootProject.name = "multi.module"

include("amond-presentation")
include("amond-infrastructure")
include("amond-domain")
include("amond-application")
include("amond-api")
