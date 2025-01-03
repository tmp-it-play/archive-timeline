package com.snowykte0426.myblog.security.jwt.component

import com.snowykte0426.myblog.security.jwt.repository.RefreshTokenRedisRepository
import org.springframework.stereotype.Component

@Component
class ExistenceRefreshToken(private val refreshTokenRedisRepository: RefreshTokenRedisRepository) {
    fun execute(token: String): Boolean {
        return refreshTokenRedisRepository.existsById(token)
    }
}