package com.snowykte0426.myblog.api.domain.article.presentation.controller

import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.request.PatchArticleRequest
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.request.PostArticleRequest
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.response.ArticleResponse
import com.snowykte0426.myblog.api.domain.article.service.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/articles")
class ArticleController(
    private val getAllArticleService: GetAllArticleService,
    private val getArticleService: GetArticleService,
    private val postArticleService: PostArticleService,
    private val patchArticleService: PatchArticleService,
    private val deleteArticleService: DeleteArticleService
) {
    @GetMapping
    fun getArticles(): ResponseEntity<List<ArticleResponse>> {
        return ResponseEntity.ok(getAllArticleService.execute())
    }

    @GetMapping("/{id}")
    fun getArticle(@PathVariable id: Long): ResponseEntity<ArticleResponse> {
        return ResponseEntity.ok(getArticleService.execute(id))
    }

    @PostMapping
    fun postArticle(@RequestBody request: PostArticleRequest): ResponseEntity<ArticleResponse> {
        return ResponseEntity.status(201).body(
            postArticleService.execute(
                title = request.title,
                content = request.content,
                tag = request.tag,
                image = request.image
            )
        )
    }

    @PatchMapping("/{id}")
    fun patchArticle(
        @PathVariable id: Long,
        @RequestBody request: PatchArticleRequest
    ): ResponseEntity<ArticleResponse> {
        return ResponseEntity.ok(
            patchArticleService.execute(
                id = id,
                title = request.title,
                content = request.content,
                tag = request.tag,
                image = request.image
            )
        )
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteArticle(@PathVariable id: Long) {
        deleteArticleService.execute(id)
    }
}