package com.amond.multi.module.domain.article.domain.service.impl

import com.amond.multi.module.domain.article.Article
import com.amond.multi.module.domain.article.data.dto.ArticleDto
import com.amond.multi.module.domain.article.domain.service.PostArticleService
import com.amond.multi.module.persistence.article.mapper.ArticleMapper
import com.amond.multi.module.persistence.article.repository.ArticleJpaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
open class PostArticleServiceImpl(
    private val articleJpaRepository: ArticleJpaRepository,
    private val articleMapper: ArticleMapper
) : PostArticleService {
    override fun execute(content: String): ArticleDto {
        val article = Article(idx = null, content = content, viewCount = 0)
        val savedArticle = articleJpaRepository.save(articleMapper.toEntity(article))
        return ArticleDto(savedArticle.idx, savedArticle.content, savedArticle.viewCount)
    }
}