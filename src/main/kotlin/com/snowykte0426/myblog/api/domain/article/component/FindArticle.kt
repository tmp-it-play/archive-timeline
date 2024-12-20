package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.entity.Article
import com.snowykte0426.myblog.api.domain.article.exception.ArticleNotFoundException
import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class FindArticle(private val articleRepository: ArticleRepository) {
    fun execute(): List<Article> {
        return articleRepository.findAll()
    }

    fun execute(id: Long): Article {
        return articleRepository.findById(id).orElseThrow { ArticleNotFoundException("Article with ID $id not found") }
    }
}