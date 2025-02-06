package com.amond.multi.module.article.dto.response

data class ArticleResponse(
    val idx: Long,
    val content: String,
    val viewCount: Long
)