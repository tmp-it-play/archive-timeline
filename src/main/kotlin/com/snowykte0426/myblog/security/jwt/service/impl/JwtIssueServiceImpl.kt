package com.snowykte0426.myblog.security.jwt.service.impl

import com.snowykte0426.myblog.security.jwt.component.SaveRefreshToken
import com.snowykte0426.myblog.security.jwt.entity.RefreshToken
import com.snowykte0426.myblog.security.jwt.exception.RefreshTokenSaveException
import com.snowykte0426.myblog.security.jwt.presentation.dto.TokenDto
import com.snowykte0426.myblog.security.jwt.service.JwtIssueService
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@Service
class JwtIssueServiceImpl(
    @Value("\${spring.security.jwt.secret}")
    private val secretKey: String,
    @Value("\${spring.security.jwt.access-token-expiration}")
    private val accessTokenExpiration: Long,
    @Value("\${spring.security.jwt.refresh-token-expiration}")
    private val refreshTokenExpiration: Long,
    private val saveRefreshToken: SaveRefreshToken
) : JwtIssueService {
    private val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
    override fun issueAccessToken(userId: String): TokenDto {
        val expirationTime: LocalDateTime = LocalDateTime.now().plusSeconds(accessTokenExpiration)
        val accessToken: String = Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(Date.from(expirationTime.atZone(ZoneId.systemDefault()).toInstant()))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
        return TokenDto(accessToken, expirationTime)
    }

    override fun issueRefreshToken(userId: String): TokenDto {
        val expirationTime: LocalDateTime = LocalDateTime.now().plusSeconds(refreshTokenExpiration)
        val refreshToken: String = Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()))
            .setExpiration(Date.from(expirationTime.atZone(ZoneId.systemDefault()).toInstant()))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
        if (!saveRefreshToken.execute(RefreshToken(refreshToken, expirationTime))) {
            throw RefreshTokenSaveException("Failed to save refresh token")
        }
        return TokenDto(refreshToken, expirationTime)
    }
}