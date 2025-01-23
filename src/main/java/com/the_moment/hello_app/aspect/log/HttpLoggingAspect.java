package com.the_moment.hello_app.aspect.log;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.CodeSignature;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.*;

@Aspect
@Component
public class HttpLoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(HttpLoggingAspect.class);

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void onRequest() {
    }

    @Around("onRequest()")
    public Object logging(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String ip = request.getRemoteAddr();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String sessionId = request.getRequestedSessionId();
        String params = request.getQueryString();
        String contentType = request.getContentType();
        String userAgent = request.getHeader("User-Agent");
        MethodSignature signature = (MethodSignature) proceedingJoinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();
        Enumeration<String> headerNames = request.getHeaderNames();
        Set<String> headerSet = new HashSet<>();
        while (headerNames.hasMoreElements()) {
            headerSet.add(headerNames.nextElement());
        }
        UUID code = UUID.randomUUID();
        log.info("At {}#{} [Request:{}] IP: {}, Session-ID: {}, URI: {}, Params: {}, Content-Type: {}, User-Agent: {}, Headers: {}, Parameters: {}, Code: {}",
                className, methodName, method, ip, sessionId, uri, params, contentType, userAgent, headerSet, getParams(proceedingJoinPoint), code);
        Object result = proceedingJoinPoint.proceed();
        if (result instanceof ResponseEntity<?> responseEntity) {
            log.info("At {}#{} [Response:{}] IP: {}, Session-ID: {}, Headers: {}, Response: {}, Status-Code: {}, Code: {}",
                    className, methodName, method, ip, sessionId, responseEntity.getHeaders(), responseEntity.getBody(), responseEntity.getStatusCode(), code);
        } else if (result == null) {
            log.info("At {}#{} [Response: null] IP: {}, Session-ID: {}, Code: {}",
                    className, methodName, ip, sessionId, code);
        } else {
            throw new RuntimeException("유효하지 않은 Controller 반환 타입입니다.");
        }
        return result;
    }

    private Map<String, Object> getParams(ProceedingJoinPoint joinPoint) {
        CodeSignature codeSignature = (CodeSignature) joinPoint.getSignature();
        String[] parameterNames = codeSignature.getParameterNames();
        Object[] args = joinPoint.getArgs();
        Map<String, Object> params = new HashMap<>();
        for (int i = 0; i < parameterNames.length; i++) {
            params.put(parameterNames[i], args[i]);
        }
        return params;
    }
}