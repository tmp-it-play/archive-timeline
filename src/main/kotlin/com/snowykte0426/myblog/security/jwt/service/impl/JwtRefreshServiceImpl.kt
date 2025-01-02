package com.snowykte0426.myblog.security.jwt.service.impl

import com.snowykte0426.myblog.security.jwt.presentation.dto.TokenDto
import com.snowykte0426.myblog.security.jwt.service.JwtRefreshService

class JwtRefreshServiceImpl(

) : JwtRefreshService {
    override fun refreshAccessToken(refreshToken: String): TokenDto {
        TODO("Not yet implemented")
    }
}