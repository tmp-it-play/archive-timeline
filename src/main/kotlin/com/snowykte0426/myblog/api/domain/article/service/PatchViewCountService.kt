package com.snowykte0426.myblog.api.domain.article.service

import com.snowykte0426.myblog.api.domain.article.presentation.dto.ArticleDto

interface PatchViewCountService {
    fun execute(id: Long): ArticleDto
}