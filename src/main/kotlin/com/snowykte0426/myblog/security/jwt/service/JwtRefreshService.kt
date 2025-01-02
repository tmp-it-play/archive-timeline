package com.snowykte0426.myblog.security.jwt.service

import com.snowykte0426.myblog.security.jwt.presentation.dto.TokenDto

interface JwtRefreshService {
    fun refreshAccessToken(refreshToken: String): TokenDto
}