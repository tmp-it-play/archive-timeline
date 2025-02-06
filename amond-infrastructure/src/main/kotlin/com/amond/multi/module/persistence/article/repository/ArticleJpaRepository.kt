package com.amond.multi.module.persistence.article.repository

import com.amond.multi.module.persistence.article.entity.ArticleJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ArticleJpaRepository: JpaRepository<ArticleJpaEntity, Long>