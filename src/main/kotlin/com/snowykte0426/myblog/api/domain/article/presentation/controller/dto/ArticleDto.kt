package com.snowykte0426.myblog.api.domain.article.presentation.controller.dto

import com.snowykte0426.myblog.api.domain.article.entity.Article

data class ArticleDto(
    val id: Long?,
    val title: String,
    val content: String,
    val tag: String,
    val createdAt: String,
    val viewCount: Long,
    val imageUrl: String
) {
    fun toEntity() = Article(
        id = id,
        title = title,
        content = content,
        tag = tag,
        createdAt = java.time.LocalDateTime.parse(createdAt),
        viewCount = viewCount,
        imageName = "",
        imageUrl = imageUrl
    )
}