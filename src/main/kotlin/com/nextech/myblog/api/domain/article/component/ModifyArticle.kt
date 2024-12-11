package com.nextech.myblog.api.domain.article.component

import com.nextech.myblog.api.domain.article.exception.ArticleNotFoundException
import com.nextech.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class ModifyArticle(private val articleRepository: ArticleRepository) {
    fun execute(id: Long, title: String, content: String, tag: String, image: String) {
        val article = articleRepository.findById(id).orElseThrow { ArticleNotFoundException("Article with ID $id not found") }
        article.title = title
        article.content = content
        article.tag = tag
        article.imageUrl = image
        articleRepository.save(article)
    }
}