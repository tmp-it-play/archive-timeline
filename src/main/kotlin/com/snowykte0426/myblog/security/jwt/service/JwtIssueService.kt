package com.snowykte0426.myblog.security.jwt.service

import com.snowykte0426.myblog.security.jwt.presentation.dto.TokenDto

interface JwtIssueService {
    fun issueAccessToken(userId: String): TokenDto
    fun issueRefreshToken(userId: String): TokenDto
}