FROM openjdk:17-jdk-alpine3.13 AS build
WORKDIR /app
ARG JAR_FILE=build/libs/application-1.0.0.jar
COPY ${JAR_FILE} app.jar
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]