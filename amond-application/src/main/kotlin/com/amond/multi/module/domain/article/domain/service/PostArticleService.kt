package com.amond.multi.module.domain.article.domain.service

import com.amond.multi.module.domain.article.data.dto.ArticleDto

interface PostArticleService {
    fun execute(
        content: String
    ): ArticleDto
}