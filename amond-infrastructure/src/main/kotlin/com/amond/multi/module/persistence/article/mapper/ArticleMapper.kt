package com.amond.multi.module.persistence.article.mapper

import com.amond.multi.module.persistence.article.GenericMapper
import com.amond.multi.module.persistence.article.entity.ArticleJpaEntity
import com.amond.multi.module.domain.article.Article
import org.springframework.stereotype.Component

@Component
class ArticleMapper : GenericMapper<ArticleJpaEntity, Article> {
    override fun toEntity(dto: Article): ArticleJpaEntity {
        return ArticleJpaEntity(
            idx = dto.idx,
            content = dto.content,
            viewCount = dto.viewCount
        )
    }

    override fun toDomain(entity: ArticleJpaEntity): Article {
        return Article(
            idx = entity.idx,
            content = entity.content,
            viewCount = entity.viewCount
        )
    }
}