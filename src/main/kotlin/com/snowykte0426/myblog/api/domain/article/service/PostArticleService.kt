package com.snowykte0426.myblog.api.domain.article.service

import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.response.ArticleResponse

interface PostArticleService {
    fun execute(title: String, content: String, tag: String, image: String): ArticleResponse
}