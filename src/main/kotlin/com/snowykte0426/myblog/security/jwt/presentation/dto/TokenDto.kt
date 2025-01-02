package com.snowykte0426.myblog.security.jwt.presentation.dto

import java.time.LocalDateTime

data class TokenDto(
    val token: String,
    val expiration: LocalDateTime
)