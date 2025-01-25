package com.the_moment.hello_app.global.mapper;

public interface GenericMapper<T, U> {
    T toEntity(U domain);

    U toDomain(T entity);
}