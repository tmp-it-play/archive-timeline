package com.snowykte0426.myblog.security.jwt.service

interface JwtIssueService {
    fun issueAccessToken(userId: String): String
    fun issueRefreshToken(userId: String): String
}