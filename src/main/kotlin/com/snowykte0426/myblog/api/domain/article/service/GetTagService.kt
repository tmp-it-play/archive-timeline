package com.snowykte0426.myblog.api.domain.article.service

import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.response.TagResponse

interface GetTagService {
    fun execute(): TagResponse
}