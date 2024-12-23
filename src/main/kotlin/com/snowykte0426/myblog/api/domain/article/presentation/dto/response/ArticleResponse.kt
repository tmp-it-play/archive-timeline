package com.snowykte0426.myblog.api.domain.article.presentation.dto.response

data class ArticleResponse(
    val id: Long,
    val title: String,
    val content: String,
    val tag: String,
    val createdAt: String,
    val viewCount: Long,
    val imageUrl: String?
)