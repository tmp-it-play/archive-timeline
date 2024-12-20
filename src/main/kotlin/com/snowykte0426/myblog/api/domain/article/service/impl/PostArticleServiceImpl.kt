package com.snowykte0426.myblog.api.domain.article.service.impl

import com.snowykte0426.myblog.api.domain.article.component.CreateArticle
import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.response.ArticleResponse
import com.snowykte0426.myblog.api.domain.article.service.PostArticleService
import com.snowykte0426.myblog.api.global.aws.service.FileUploadService
import com.snowykte0426.myblog.api.global.util.Base64DecodedMultipartFile
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*

@Service
class PostArticleServiceImpl(
    @Value("\${aws.s3.dev-url}")
    private val devUrl: String,
    private val createArticle: CreateArticle,
    private val fileUploadService: FileUploadService
) : PostArticleService {
    override fun execute(
        title: String,
        content: String,
        tag: String,
        image: String
    ): ArticleResponse {
        val decodedImage = Base64.getDecoder().decode(image.substringAfter("base64,"))
        val multipartFile = Base64DecodedMultipartFile(decodedImage, "image/jpeg")
        val (uploadedFileUrl, uploadedFileName) = fileUploadService.uploadFile(multipartFile)
        val article = createArticle.execute(title, content, tag, uploadedFileName, uploadedFileUrl)
        return ArticleResponse(
            id = article.id!!,
            title = article.title,
            content = article.content,
            tag = article.tag,
            createdAt = article.createdAt.toString(),
            viewCount = article.viewCount,
            imageUrl = article.imageUrl
        )
    }
}