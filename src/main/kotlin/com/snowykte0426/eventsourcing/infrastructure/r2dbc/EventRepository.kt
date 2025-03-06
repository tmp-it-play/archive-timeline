package com.snowykte0426.eventsourcing.infrastructure.r2dbc

import org.springframework.data.r2dbc.repository.R2dbcRepository
import reactor.core.publisher.Flux

interface EventRepository : R2dbcRepository<EventEntity, Long> {
    fun findByAggregateIdOrderByCreatedAt(aggregateId: String): Flux<EventEntity>
}