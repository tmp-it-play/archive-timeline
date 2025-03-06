package com.snowykte0426.eventsourcing.infrastructure.r2dbc

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime

@Table("event_store")
data class EventEntity(
    @Id val id: Long? = null,
    val aggregateId: String,
    val eventType: String,
    val payload: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)