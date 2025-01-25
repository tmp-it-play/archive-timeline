FROM gradle:7.6.0-jdk17 AS build
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts gradlew /app/
COPY gradle /app/gradle
COPY src /app/src
COPY buildSrc /app/buildSrc
RUN ./gradlew clean build --no-daemon
FROM openjdk:17-jdk-alpine3.13
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]