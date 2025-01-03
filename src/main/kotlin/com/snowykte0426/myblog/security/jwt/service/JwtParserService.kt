package com.snowykte0426.myblog.security.jwt.service

interface JwtParserService {
    fun extractUserId(token: String): String
    fun validateToken(token: String): Boolean
    fun validateRefreshToken(token: String): Boolean
}