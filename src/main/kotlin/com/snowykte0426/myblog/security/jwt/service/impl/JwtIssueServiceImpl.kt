package com.snowykte0426.myblog.security.jwt.service.impl

import com.snowykte0426.myblog.security.jwt.service.JwtIssueService
import org.springframework.stereotype.Service

@Service
class JwtIssueServiceImpl(

) : JwtIssueService {
    override fun issueAccessToken(userId: String): String {
        TODO("Not yet implemented")
    }

    override fun issueRefreshToken(userId: String): String {
        TODO("Not yet implemented")
    }
}