package com.snowykte0426.eventsourcing.infrastructure.r2dbc

sealed interface DomainEvent

data class UserRegisteredEvent(
    val userId: String,
    val username: String,
    val email: String
) : DomainEvent