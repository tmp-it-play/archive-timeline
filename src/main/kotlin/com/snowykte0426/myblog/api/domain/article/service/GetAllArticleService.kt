package com.snowykte0426.myblog.api.domain.article.service

import com.snowykte0426.myblog.api.domain.article.presentation.dto.response.ArticleResponse

interface GetAllArticleService {
    fun execute(): List<ArticleResponse>
}