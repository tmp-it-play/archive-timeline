package com.snowykte0426.eventsourcing.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Bean
fun objectMapper(): ObjectMapper =
    ObjectMapper().registerModule(KotlinModule.Builder().build())