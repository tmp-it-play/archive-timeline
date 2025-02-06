package com.amond.multi.module.domain.article.domain.service

import com.amond.multi.module.domain.article.data.dto.ArticleDto

interface GetArticleService {
    fun execute(): List<ArticleDto>
}