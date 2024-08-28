package com.nextech.amond

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class AmondApplication

fun main(args: Array<String>) {
	runApplication<AmondApplication>(*args)
}
