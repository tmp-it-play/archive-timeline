package com.amond.multi.module.global.filter

import jakarta.servlet.*
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.util.ContentCachingRequestWrapper
import org.springframework.web.util.ContentCachingResponseWrapper

@Component
class RequestCachingFilter : Filter {
    override fun init(filterConfig: FilterConfig?) {}

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val wrappedRequest = ContentCachingRequestWrapper(request as HttpServletRequest)
        val wrappedResponse = ContentCachingResponseWrapper(response as HttpServletResponse)
        chain.doFilter(wrappedRequest, wrappedResponse)
        wrappedResponse.copyBodyToResponse()
    }

    override fun destroy() {}
}