package com.amond.multi.module.article.dto

import com.amond.multi.module.article.dto.mapper.ArticleDataMapper
import com.amond.multi.module.article.dto.request.PostArticleRequest
import com.amond.multi.module.article.dto.response.ArticleResponse
import com.amond.multi.module.domain.article.domain.service.GetArticleService
import com.amond.multi.module.domain.article.domain.service.PostArticleService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/article")
class ArticleController(
    private val articleDataMapper: ArticleDataMapper,
    private val getArticleService: GetArticleService,
    private val postArticleService: PostArticleService
) {
    @GetMapping
    fun getArticles(): List<ArticleResponse> {
        return getArticleService.execute().map { articleDataMapper.toResponse(it) }
    }

    @PostMapping
    fun postArticle(@RequestBody postArticleRequest: PostArticleRequest): ArticleResponse {
        return articleDataMapper.toResponse(postArticleService.execute(postArticleRequest.content))
    }
}