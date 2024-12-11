package com.nextech.myblog.api.domain.article.service.impl

import com.nextech.myblog.api.domain.article.component.CreateArticle
import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse
import com.nextech.myblog.api.domain.article.service.PostArticleService
import com.nextech.myblog.api.global.aws.service.FileUploadService
import com.nextech.myblog.api.global.util.Base64DecodedMultipartFile
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
    override fun execute(title: String, content: String, tag: String, image: String): ArticleResponse {
        val article = createArticle.execute(title, content, tag)
        val decodedImage = Base64.getDecoder().decode(image.substringAfter("base64,"))
        val multipartFile = Base64DecodedMultipartFile(decodedImage, "image/jpeg")
        val uploadResult = fileUploadService.uploadFile(multipartFile).get()
        val uploadedUrl = uploadResult.first
        val uploadedFileName = uploadResult.second
        println("Uploaded file URL: $uploadedUrl, Name: $uploadedFileName")
        return ArticleResponse(
            id = article.id!!,
            title = article.title,
            content = article.content,
            tag = article.tag,
            createdAt = article.createdAt.toString(),
            viewCount = article.viewCount,
            imageUrl = devUrl + "/" + uploadedFileName
        )
    }
}