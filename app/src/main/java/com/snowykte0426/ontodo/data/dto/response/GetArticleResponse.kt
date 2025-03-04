package com.snowykte0426.ontodo.data.dto.response

import com.snowykte0426.ontodo.data.model.TodoArticle

data class GetArticleResponse(
    val totalPage: Int,
    val totalElements: Long,
    val articles: List<TodoArticle>
)