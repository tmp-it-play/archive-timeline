package com.snowykte0426.myblog.api.domain.article.repository

import com.snowykte0426.myblog.api.domain.article.entity.Article
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ArticleRepository: JpaRepository<Article, Long>