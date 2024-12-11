package com.nextech.myblog.api.domain.article.service

import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse

interface PatchArticleService {
    fun execute(id: Long, title: String?, content: String?, tag: String?, image: String?): ArticleResponse
}