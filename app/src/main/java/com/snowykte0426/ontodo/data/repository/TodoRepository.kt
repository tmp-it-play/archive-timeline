package com.snowykte0426.ontodo.data.repository

import com.snowykte0426.ontodo.data.api.RetrofitClient
import com.snowykte0426.ontodo.data.dto.request.PatchArticleRequest
import com.snowykte0426.ontodo.data.dto.request.PostArticleRequest

class TodoRepository {
    private val api = RetrofitClient.apiService

    suspend fun getArticles() = api.getArticles().articles

    suspend fun searchArticles(keyword: String?) = api.searchArticles(
        keyword = keyword,
        isCompleted = null,
        date = null,
        level = null,
        offset = 0,
        limit = 20
    ).articles

    suspend fun createArticle(content: String, level: String) =
        api.createArticle(PostArticleRequest(content, level))

    suspend fun updateArticle(id: Long, content: String?, level: String?, isCompleted: Boolean?) =
        api.updateArticle(id, PatchArticleRequest(content, level, isCompleted))

    suspend fun deleteArticle(id: Long) = api.deleteArticle(id)
}