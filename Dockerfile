FROM amazoncorretto:21-alpine AS builder
WORKDIR /app
RUN apk update && apk add --no-cache tzdata curl bash openjdk21 zip \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata
RUN curl -s "https://get.sdkman.io" | bash \
    && bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install gradle 8.11.1"
COPY . .
RUN bash -c "source /root/.sdkman/bin/sdkman-init.sh \
    && rm -rf /root/.gradle/caches \
    && gradle clean build -x test --no-daemon --info"
RUN rm -rf /root/.sdkman \
    && rm -rf /root/.gradle \
    && rm -rf /app/.gradle \
    && rm -rf /app/build/tmp \
    && rm -rf /app/build/intermediates
FROM amazoncorretto:21-alpine AS runtime
WORKDIR /app
RUN apk update && apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 9997
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--server.port=9997"]