package com.amond.multi.module.global.aspect

import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Pointcut
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.request.ServletRequestAttributes
import org.springframework.web.util.ContentCachingRequestWrapper
import kotlin.jvm.Throws

@Aspect
@Component
class HttpLoggingAspect {

    private val log by lazy { LoggerFactory.getLogger(this::class.java) }

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    fun onRestController() { }

    @Around("onRestController()")
    @Throws(Throwable::class)
    fun logRequestResponse(joinPoint: org.aspectj.lang.ProceedingJoinPoint): Any? {
        val request = (RequestContextHolder.getRequestAttributes() as? ServletRequestAttributes)?.request
        if (request != null) {
            val cachingRequest = request as? ContentCachingRequestWrapper ?: ContentCachingRequestWrapper(request)

            val requestURI = cachingRequest.requestURI
            val requestMethod = cachingRequest.method
            val requestQueryString = cachingRequest.queryString
            val requestHeader = cachingRequest.headerNames.toList().associateWith { cachingRequest.getHeader(it) }
            val requestBody = cachingRequest.contentAsByteArray.decodeToString()
                .ifBlank { "Body가 없습니다" }

            log.info("Request URI: $requestURI")
            log.info("Request Method: $requestMethod")
            log.info("Request Query String: $requestQueryString")
            log.info("Request Header: $requestHeader")
            log.info("Request Body: $requestBody")
        } else {
            log.error("Request is null")
        }
        return joinPoint.proceed()
    }
}