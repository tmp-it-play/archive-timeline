package com.snowykte0426.eventsourcing.presentation.user.dto

data class RegisterUserRequest(
    val userId: String,
    val username: String,
    val email: String
)