package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.presentation.dto.ArticleDto
import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class IncreaseArticleViewCount(private val articleRepository: ArticleRepository) {
    fun execute(article: ArticleDto): ArticleDto {
        article.viewCount += 1
        return articleRepository.save((article.toEntity())).toDto()
    }
}