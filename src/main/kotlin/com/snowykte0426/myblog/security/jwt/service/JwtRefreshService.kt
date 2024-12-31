package com.snowykte0426.myblog.security.jwt.service

interface JwtRefreshService {
    fun refreshAccessToken(refreshToken: String): String
}