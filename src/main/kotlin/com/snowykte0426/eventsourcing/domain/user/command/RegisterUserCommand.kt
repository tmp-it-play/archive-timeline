package com.snowykte0426.eventsourcing.domain.user.command

data class RegisterUserCommand(
    val userId: String,
    val username: String,
    val email: String
)