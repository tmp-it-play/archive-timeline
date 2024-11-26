package com.nextech.myblog

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class MyBlogApplication

fun main(args: Array<String>) {
	runApplication<MyBlogApplication>(*args)
}
