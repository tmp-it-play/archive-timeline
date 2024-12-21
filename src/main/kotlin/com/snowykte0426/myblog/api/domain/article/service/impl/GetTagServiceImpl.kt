package com.snowykte0426.myblog.api.domain.article.service.impl

import com.snowykte0426.myblog.api.domain.article.component.FindArticle
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.response.TagResponse
import com.snowykte0426.myblog.api.domain.article.service.GetTagService
import org.springframework.stereotype.Service

@Service
class GetTagServiceImpl(private val findArticle: FindArticle) : GetTagService {
    override fun execute(): TagResponse {
        val articles = findArticle.execute()
        val tags = articles.map { it.tag }
        return TagResponse(tags = tags.joinToString(","))
    }
}