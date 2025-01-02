package com.snowykte0426.myblog.api.global.exception.handler

import com.snowykte0426.myblog.api.domain.article.exception.ArticleNotFoundException
import com.snowykte0426.myblog.api.global.exception.dto.request.ExceptionResponse
import com.snowykte0426.myblog.api.global.exception.enums.ExceptionLevel
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(ArticleNotFoundException::class)
    fun handleArticleNotFoundException(e: ArticleNotFoundException): ExceptionResponse {
        return ExceptionResponse(
            message = e.message!!,
            httpCode = HttpStatus.NOT_FOUND.value(),
            exceptionLevel = ExceptionLevel.WARN
        )
    }
}