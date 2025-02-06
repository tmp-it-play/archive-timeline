package com.amond.multi.module.domain.article.domain.service.impl

import com.amond.multi.module.domain.article.Article
import com.amond.multi.module.persistence.article.repository.ArticleJpaRepository
import com.amond.multi.module.domain.article.data.dto.ArticleDto
import com.amond.multi.module.domain.article.domain.service.GetArticleService
import com.amond.multi.module.persistence.article.mapper.ArticleMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
open class GetArticleServiceImpl(
    private val articleMapper: ArticleMapper,
    private val articleJpaRepository: ArticleJpaRepository
) : GetArticleService {
    override fun execute(): List<ArticleDto> {
        var articleJpaEntities: List<Article> = articleJpaRepository.findAll().map { articleMapper.toDomain(it).apply { viewCount++ } }
        articleJpaRepository.saveAll(articleJpaEntities.map { articleMapper.toEntity(it) })
        return articleJpaEntities.map {
            ArticleDto(
                id = it.idx!!,
                content = it.content,
                viewCount = it.viewCount
            )
        }
    }
}