package com.snowykte0426.myblog.api.domain.article.component

import com.snowykte0426.myblog.api.domain.article.exception.ArticleNotFoundException
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.ArticleDto
import com.snowykte0426.myblog.api.domain.article.repository.ArticleRepository
import org.springframework.stereotype.Component

@Component
class FindArticle(private val articleRepository: ArticleRepository) {
    fun execute(): List<ArticleDto> {
        return articleRepository.findAll().map {
            ArticleDto(
                id = it.id!!,
                title = it.title,
                content = it.content,
                tag = it.tag,
                createdAt = it.createdAt.toString(),
                viewCount = it.viewCount,
                imageName = it.imageName,
                imageUrl = it.imageUrl
            )
        }
    }

    fun execute(id: Long): ArticleDto {
        return articleRepository.findById(id).orElseThrow { ArticleNotFoundException("Article with ID $id not found") }
            .toDto()
    }
}