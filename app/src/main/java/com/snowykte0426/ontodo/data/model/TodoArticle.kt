package com.snowykte0426.ontodo.data.model

data class TodoArticle(
    val id: Int,
    val context: String,
    val level: Int,
    val isComplete: Boolean
)
