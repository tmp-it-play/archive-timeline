package com.snowykte0426.myblog.security.jwt.exception;

public class RefreshTokenSaveException extends RuntimeException {
    public RefreshTokenSaveException(String message) {
        super(message);
    }
}