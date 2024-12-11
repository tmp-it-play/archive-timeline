package com.nextech.myblog.api.domain.article.service

import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse

interface GetAllArticleService {
    fun execute(): List<ArticleResponse>
}