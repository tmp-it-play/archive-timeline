package com.snowykte0426.ontodo.data.model

data class TodoArticle(
    val id: Long,
    val content: String,
    val level: String,
    val isCompleted: Boolean
)