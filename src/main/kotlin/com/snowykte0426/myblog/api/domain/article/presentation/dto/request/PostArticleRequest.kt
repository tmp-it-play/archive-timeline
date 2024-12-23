package com.snowykte0426.myblog.api.domain.article.presentation.dto.request

import org.jetbrains.annotations.NotNull

data class PostArticleRequest(
    @field:NotNull val title: String,
    @field:NotNull val content: String,
    @field:NotNull val tag: String,
    @field:NotNull val image: String
)