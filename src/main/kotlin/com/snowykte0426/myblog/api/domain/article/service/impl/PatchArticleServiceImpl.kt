package com.snowykte0426.myblog.api.domain.article.service.impl

import com.snowykte0426.myblog.api.domain.article.component.FindArticle
import com.snowykte0426.myblog.api.domain.article.component.ModifyArticle
import com.snowykte0426.myblog.api.domain.article.presentation.dto.response.ArticleResponse
import com.snowykte0426.myblog.api.domain.article.service.PatchArticleService
import com.snowykte0426.myblog.api.global.aws.service.FileDeleteService
import com.snowykte0426.myblog.api.global.aws.service.FileUploadService
import com.snowykte0426.myblog.api.global.util.Base64DecodedMultipartFile
import org.springframework.stereotype.Service
import java.util.*

@Service
class PatchArticleServiceImpl(
    private val findArticle: FindArticle,
    private val modifyArticle: ModifyArticle,
    private val fileUploadService: FileUploadService,
    private val fileDeleteService: FileDeleteService
) : PatchArticleService {
    override fun execute(
        id: Long,
        title: String?,
        content: String?,
        tag: String?,
        image: String?
    ): ArticleResponse {
        val article = findArticle.execute(id)
        title?.let { article.title = it }
        content?.let { article.content = it }
        tag?.let { article.tag = it }
        image?.let {
            fileDeleteService.deleteFile(article.imageName)
            val decodedImage = Base64.getDecoder().decode(it.substringAfter("base64,"))
            val multipartFile = Base64DecodedMultipartFile(decodedImage, "image/jpeg")
            val (uploadedUrl, uploadedFileName) = fileUploadService.uploadFile(multipartFile)
            article.imageUrl = uploadedUrl
            article.imageName = uploadedFileName
        }
        modifyArticle.execute(
            id = article.id!!,
            title = article.title,
            content = article.content,
            tag = article.tag,
            imageUrl = article.imageUrl,
            imageName = article.imageName
        )
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