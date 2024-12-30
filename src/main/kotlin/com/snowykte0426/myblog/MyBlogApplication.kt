package com.snowykte0426.myblog

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class MyBlogApplication

fun main(args: Array<String>) {
	runApplication<MyBlogApplication>(*args)
}
