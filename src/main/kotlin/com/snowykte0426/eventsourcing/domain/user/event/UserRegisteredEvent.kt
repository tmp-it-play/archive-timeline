package com.snowykte0426.eventsourcing.domain.user.event

sealed interface DomainEvent

data class UserRegisteredEvent(
    val userId: String,
    val username: String,
    val email: String
) : DomainEvent