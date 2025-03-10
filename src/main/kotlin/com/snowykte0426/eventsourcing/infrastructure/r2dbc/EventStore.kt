package com.snowykte0426.eventsourcing.infrastructure.r2dbc

import com.fasterxml.jackson.databind.ObjectMapper
import com.snowykte0426.eventsourcing.domain.user.event.DomainEvent
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class EventStore(
    private val eventRepository: EventRepository,
    private val objectMapper: ObjectMapper
) {

    fun saveEvent(aggregateId: String, event: DomainEvent): Mono<Void> {
        val payload = objectMapper.writeValueAsString(event)
        val entity = EventEntity(
            aggregateId = aggregateId,
            eventType = event::class.simpleName!!,
            payload = payload
        )
        return eventRepository.save(entity).then()
    }

    fun loadEvents(aggregateId: String): Flux<DomainEvent> {
        return eventRepository.findByAggregateIdOrderByCreatedAt(aggregateId)
            .flatMap { entity ->
                try {
                    val clazz = Class.forName("com.snowykte0426.eventsourcing.domain.user.event.${entity.eventType}")
                    val event = objectMapper.readValue(entity.payload, clazz) as? DomainEvent
                        ?: return@flatMap Mono.error<DomainEvent>(IllegalArgumentException("Invalid event type: ${entity.eventType}"))
                    Mono.just(event)
                } catch (e: Exception) {
                    Mono.error<DomainEvent>(IllegalArgumentException("Failed to load event: ${entity.eventType}", e))
                }
            }
    }
}