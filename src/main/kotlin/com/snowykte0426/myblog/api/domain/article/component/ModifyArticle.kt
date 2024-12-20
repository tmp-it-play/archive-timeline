package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.exception.ArticleNotFoundException
import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class ModifyArticle(private val articleRepository: ArticleRepository) {
    fun execute(id: Long, title: String, content: String, tag: String, imageName: String, imageUrl: String) {
        val article =
            articleRepository.findById(id).orElseThrow { ArticleNotFoundException("Article with ID $id not found") }
        article.title = title
        article.content = content
        article.tag = tag
        article.imageUrl = imageUrl
        article.imageName = imageName
        articleRepository.save(article)
    }
}