package com.snowykte0426.ontodo.data.api

import com.snowykte0426.ontodo.data.model.TodoArticle
import retrofit2.http.*

interface ApiService {
    @GET("api/v1/articles")
    suspend fun getArticles(
        @Query("offset") offset: Int,
        @Query("limit") limit: Int
    ): List<TodoArticle>

    @GET("api/v1/articles/search")
    suspend fun searchArticles(
        @Query("keyword") keyword: String?,
        @Query("isComplete") isComplete: Boolean?,
        @Query("date") date: String?,
        @Query("level") level: Int?,
        @Query("offset") offset: Int,
        @Query("limit") limit: Int
    ): List<TodoArticle>

    @POST("api/v1/articles")
    suspend fun createArticle(@Body todo: TodoArticle): TodoArticle

    @PUT("api/v1/articles/{articleId}")
    suspend fun updateArticle(@Path("articleId") id: Int, @Body todo: TodoArticle): TodoArticle

    @DELETE("api/v1/articles/{articleId}")
    suspend fun deleteArticle(@Path("articleId") id: Int)

    @PATCH("api/v1/articles/{articleId}/complate")
    suspend fun completeTodo(
        @Path("articleId") id: Int,
        @Body body: Map<String, Boolean>
    )
}