package com.snowykte0426.eventsourcing

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class EventSourcingApplication

fun main(args: Array<String>) {
    runApplication<EventSourcingApplication>(*args)
}
