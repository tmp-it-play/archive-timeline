package com.snowykte0426.myblog.api.global.exception.dto.request

import com.snowykte0426.myblog.api.global.exception.enums.ExceptionLevel

data class ExceptionResponse(
    val message: String,
    val httpCode: Int,
    val exceptionLevel: ExceptionLevel
)