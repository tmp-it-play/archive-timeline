package com.snowykte0426.ontodo.data.api

import com.snowykte0426.ontodo.data.dto.request.PatchArticleRequest
import com.snowykte0426.ontodo.data.dto.request.PostArticleRequest
import com.snowykte0426.ontodo.data.dto.response.GetArticleResponse
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @GET("api/v1/articles")
    suspend fun getArticles(): GetArticleResponse

    @GET("api/v1/articles/search")
    suspend fun searchArticles(
        @Query("keyword") keyword: String?,
        @Query("isCompleted") isCompleted: Boolean?,
        @Query("date") date: String?,
        @Query("level") level: String?,
        @Query("offset") offset: Int?,
        @Query("limit") limit: Int?
    ): GetArticleResponse

    @POST("api/v1/articles")
    suspend fun createArticle(@Body request: PostArticleRequest): Response<Unit>

    @PATCH("api/v1/articles/{articleId}")
    suspend fun updateArticle(
        @Path("articleId") id: Long,
        @Body request: PatchArticleRequest
    ): Response<Unit>

    @DELETE("api/v1/articles/{articleId}")
    suspend fun deleteArticle(@Path("articleId") id: Long): Response<Unit>
}