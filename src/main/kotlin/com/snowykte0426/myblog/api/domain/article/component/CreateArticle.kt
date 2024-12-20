package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.entity.Article
import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class CreateArticle(private val articleRepository: ArticleRepository) {
    fun execute(title: String, content: String, tag: String): Article {
        return articleRepository.save(
            Article(
                title = title,
                content = content,
                tag = tag
            )
        )
    }
}