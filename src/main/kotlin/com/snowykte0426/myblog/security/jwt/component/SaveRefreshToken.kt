package com.snowykte0426.myblog.security.jwt.component

import com.snowykte0426.myblog.security.jwt.entity.RefreshToken
import com.snowykte0426.myblog.security.jwt.repository.RefreshTokenRedisRepository
import org.springframework.stereotype.Component

@Component
class SaveRefreshToken(private val refreshTokenRedisRepository: RefreshTokenRedisRepository) {
    fun execute(refreshToken: RefreshToken): Boolean {
        return try {
            refreshTokenRedisRepository.save(refreshToken)
            true
        } catch (_: Exception) {
            false
        }
    }
}