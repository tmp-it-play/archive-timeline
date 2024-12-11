package com.nextech.myblog.api.domain.article.service

import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse

interface PostArticleService {
    fun execute(title: String, content: String, tag: String, image: String): ArticleResponse
}