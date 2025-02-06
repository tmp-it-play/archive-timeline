package com.amond.multi.module.article.dto.mapper

import com.amond.multi.module.article.dto.response.ArticleResponse
import com.amond.multi.module.domain.article.data.dto.ArticleDto
import org.springframework.stereotype.Component


@Component
class ArticleDataMapper {
    fun toResponse(articleDto: ArticleDto): ArticleResponse {
        return ArticleResponse(
            idx = articleDto.id!!,
            content = articleDto.content,
            viewCount = articleDto.viewCount
        )
    }
}