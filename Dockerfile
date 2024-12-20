FROM amazoncorretto:21-alpine AS builder
WORKDIR /app
RUN apk update && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata
RUN apk add --no-cache curl bash openjdk21 zip \
    && curl -s "https://get.sdkman.io" | bash \
    && bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install gradle 8.3"
COPY . .
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh && rm -rf ~/.gradle/caches && gradle clean build --no-daemon --info"
FROM amazoncorretto:21-alpine AS runtime
RUN apk update && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 9997
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--server.port=9997"]