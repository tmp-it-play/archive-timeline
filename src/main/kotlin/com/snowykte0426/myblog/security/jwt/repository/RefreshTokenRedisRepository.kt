package com.snowykte0426.myblog.security.jwt.repository

import com.snowykte0426.myblog.security.jwt.entity.RefreshToken
import org.springframework.data.repository.CrudRepository

interface RefreshTokenRedisRepository : CrudRepository<RefreshToken, String>