package com.snowykte0426.eventsourcing.presentation.user.dto

data class UserResponse(
    val userId: String,
    val username: String,
    val email: String
)