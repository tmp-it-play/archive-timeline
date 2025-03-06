package com.snowykte0426.eventsourcing.domain.user

import com.snowykte0426.eventsourcing.domain.user.event.DomainEvent
import com.snowykte0426.eventsourcing.domain.user.event.UserRegisteredEvent

class UserAggregate(
    val id: String
) {
    var username: String = ""
    var email: String = ""

    fun apply(event: DomainEvent) {
        when (event) {
            is UserRegisteredEvent -> {
                username = event.username
                email = event.email
            }
        }
    }

    fun applyAll(events: List<DomainEvent>) {
        events.forEach(this::apply)
    }
}