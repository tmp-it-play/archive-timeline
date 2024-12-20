package com.snowykte0426.myblog.api.domain.article.service.impl

import com.snowykte0426.myblog.api.domain.article.component.FindArticle
import com.snowykte0426.myblog.api.domain.article.component.IncreaseArticleViewCount
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.ArticleDto
import com.snowykte0426.myblog.api.domain.article.service.PatchViewCountService
import org.springframework.stereotype.Service

@Service
class PatchViewCountServiceImpl(
    private val findArticle: FindArticle,
    private val increaseArticleViewCount: IncreaseArticleViewCount
) : PatchViewCountService {
    override fun execute(id: Long): ArticleDto {
        return increaseArticleViewCount.execute(findArticle.execute(id))
    }
}