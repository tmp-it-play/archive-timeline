package com.snowykte0426.myblog.security.jwt.entity

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import java.time.LocalDateTime

@RedisHash(value = "refresh_token", timeToLive = 2 * 24 * 60 * 60)
data class RefreshToken(
    @Id val refreshToken: String,
    val expiredAt: LocalDateTime
)