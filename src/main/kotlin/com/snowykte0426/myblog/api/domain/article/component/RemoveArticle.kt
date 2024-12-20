package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class RemoveArticle(private val articleRepository: ArticleRepository) {
    fun execute(id: Long) {
        articleRepository.deleteById(id)
    }
}