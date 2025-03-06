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

    fun loadEvents(aggregateId: String): Flux<DomainEvent> =
        eventRepository.findByAggregateIdOrderByCreatedAt(aggregateId)
            .flatMap { entity ->
                val clazz = Class.forName("com.example.events.${entity.eventType}")
                Mono.just(objectMapper.readValue(entity.payload, clazz) as DomainEvent)
            }
}
