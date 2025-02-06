package com.amond.multi.module.domain.article.domain.service.impl

import com.amond.multi.module.persistence.article.repository.ArticleJpaRepository
import com.amond.multi.module.domain.article.data.dto.ArticleDto
import com.amond.multi.module.domain.article.domain.service.GetArticleService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
open class GetArticleServiceImpl(
    private val articleJpaRepository: ArticleJpaRepository
) : GetArticleService {
    override fun execute(): List<ArticleDto> {
        return articleJpaRepository.findAll().map { ArticleDto(it.idx, it.content, it.viewCount) }
    }
}