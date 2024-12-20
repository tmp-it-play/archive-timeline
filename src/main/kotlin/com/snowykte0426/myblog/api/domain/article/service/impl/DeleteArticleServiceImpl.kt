package com.snowykte0426.myblog.api.domain.article.service.impl

import com.snowykte0426.myblog.api.domain.article.component.FindArticle
import com.snowykte0426.myblog.api.domain.article.component.RemoveArticle
import com.snowykte0426.myblog.api.domain.article.service.DeleteArticleService
import com.snowykte0426.myblog.api.global.aws.service.FileDeleteService
import org.springframework.stereotype.Service

@Service
class DeleteArticleServiceImpl(
    private val fileDeleteService: FileDeleteService,
    private val findArticle: FindArticle,
    private val removeArticle: RemoveArticle
) : DeleteArticleService {
    override fun execute(articleId: Long) {
        val article = findArticle.execute(articleId)
        removeArticle.execute(articleId)
        fileDeleteService.deleteFile(article.imageName)
    }
}