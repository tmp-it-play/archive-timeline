package com.snowykte0426.myblog.security.jwt.service.impl

import com.snowykte0426.myblog.security.jwt.component.ExistenceRefreshToken
import com.snowykte0426.myblog.security.jwt.exception.InvalidTokenException
import com.snowykte0426.myblog.security.jwt.service.JwtParserService
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class JwtParserServiceImpl(
    @Value("\${spring.security.jwt.secret}")
    private val secretKey: String,
    private val existenceRefreshToken: ExistenceRefreshToken
) : JwtParserService {
    private val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
    override fun validateToken(token: String): Boolean {
        return try {
            parseToken(token)
            true
        } catch (_: Exception) {
            false
        }
    }

    override fun extractUserId(token: String): String {
        try {
            return parseToken(token).subject
        } catch (_: Exception) {
            throw InvalidTokenException("Invalid token")
        }
    }

    override fun validateRefreshToken(token: String): Boolean {
        return existenceRefreshToken.execute(token)
    }

    private fun parseToken(token: String) = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).body
}