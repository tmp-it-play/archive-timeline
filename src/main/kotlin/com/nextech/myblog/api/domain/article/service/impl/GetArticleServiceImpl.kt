package com.nextech.myblog.api.domain.article.service.impl

import com.nextech.myblog.api.domain.article.component.FindArticle
import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse
import com.nextech.myblog.api.domain.article.exception.ArticleNotFoundException
import com.nextech.myblog.api.domain.article.service.GetArticleService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class GetArticleServiceImpl(
    @Value("\${aws.s3.dev-url}")
    private val devUrl: String,
    private val findArticle: FindArticle
) : GetArticleService {
    override fun execute(id: Long): ArticleResponse {
        val article = findArticle.execute(id)
        if (article.id == null) {
            throw ArticleNotFoundException("Article with id $id not found")
        }
        return ArticleResponse(
            id = article.id!!,
            title = article.title,
            content = article.content,
            tag = article.tag,
            createdAt = article.createdAt.toString(),
            viewCount = article.viewCount,
            imageUrl = if (article.imageUrl != null) devUrl + "/" + article.imageName else null
        )
    }
}