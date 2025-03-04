package com.snowykte0426.ontodo.data.dto.request

data class PatchArticleRequest(
    val content: String? = null,
    val level: String? = null,
    val isCompleted: Boolean? = null
)