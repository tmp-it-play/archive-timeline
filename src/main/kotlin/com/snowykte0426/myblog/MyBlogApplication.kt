package com.snowykte0426.myblog

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
@EnableRedisRepositories(basePackages = ["com.snowykte0426.myblog.security.jwt.repository"])
class MyBlogApplication

fun main(args: Array<String>) {
    runApplication<MyBlogApplication>(*args)
}