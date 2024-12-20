package com.snowykte0426.myblog.api.domain.article.presentation.controller.dto

import com.snowykte0426.myblog.api.domain.article.entity.Article

data class ArticleDto(
    var id: Long?,
    var title: String,
    var content: String,
    var tag: String,
    var createdAt: String,
    var viewCount: Long,
    var imageName: String,
    var imageUrl: String
) {
    fun toEntity() = Article(
        id = id,
        title = title,
        content = content,
        tag = tag,
        createdAt = java.time.LocalDateTime.parse(createdAt),
        viewCount = viewCount,
        imageName = imageName,
        imageUrl = imageUrl
    )
}