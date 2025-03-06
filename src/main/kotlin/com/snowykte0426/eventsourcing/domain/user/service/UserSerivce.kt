package com.snowykte0426.eventsourcing.domain.user.service

import com.snowykte0426.eventsourcing.domain.user.UserAggregate
import com.snowykte0426.eventsourcing.domain.user.command.RegisterUserCommand
import com.snowykte0426.eventsourcing.domain.user.event.UserRegisteredEvent
import com.snowykte0426.eventsourcing.infrastructure.r2dbc.EventStore
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class UserService(
    private val eventStore: EventStore
) {
    fun registerUser(command: RegisterUserCommand): Mono<Void> {
        val event = UserRegisteredEvent(
            command.userId,
            command.username,
            command.email
        )
        return eventStore.saveEvent(command.userId, event)
    }

    fun getUser(userId: String): Mono<UserAggregate> {
        val aggregate = UserAggregate(userId)
        return eventStore.loadEvents(userId)
            .collectList()
            .map { aggregate.applyAll(it); aggregate }
    }
}