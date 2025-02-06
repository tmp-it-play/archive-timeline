package com.amond.multi.module.persistence.article

import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass

@MappedSuperclass
abstract class BaseIdxEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val idx: Long?
)