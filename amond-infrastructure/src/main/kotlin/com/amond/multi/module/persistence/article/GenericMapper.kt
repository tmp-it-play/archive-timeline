package com.amond.multi.module.persistence.article

interface GenericMapper<E, D> {
    fun toEntity(domain: D): E
    fun toDomain(entity: E): D
}