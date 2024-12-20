package com.snowykte0426.myblog.api.domain.article.service

interface DeleteArticleService {
    fun execute(articleId: Long)
}