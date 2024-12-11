package com.nextech.myblog.api.domain.article.service.impl

import com.nextech.myblog.api.domain.article.component.FindArticle
import com.nextech.myblog.api.domain.article.component.ModifyArticle
import com.nextech.myblog.api.domain.article.dto.response.ArticleResponse
import com.nextech.myblog.api.domain.article.service.PatchArticleService
import com.nextech.myblog.api.global.aws.service.FileUploadService
import com.nextech.myblog.api.global.util.Base64DecodedMultipartFile
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*

@Service
class PatchArticleServiceImpl(
    @Value("\${aws.s3.dev-url}")
    private val devUrl: String,
    private val findArticle: FindArticle,
    private val modifyArticle: ModifyArticle,
    private val fileUploadService: FileUploadService
) : PatchArticleService {
    override fun execute(id: Long, title: String?, content: String?, tag: String?, image: String?): ArticleResponse {
        val article = findArticle.execute(id)
        title?.let { article.title = it }
        content?.let { article.content = it }
        tag?.let { article.tag = it }
        image?.let {
            val decodedImage = Base64.getDecoder().decode(it.substringAfter("base64,"))
            val multipartFile = Base64DecodedMultipartFile(decodedImage, "image/jpeg")
            val uploadResult = fileUploadService.uploadFile(multipartFile).get() //TODO 기존 파일 삭제 및 파일 이름 갱신까지 구현!!
            val uploadedUrl = uploadResult.first
            val uploadedFileName = uploadResult.second
            println("Uploaded file URL: $uploadedUrl, Name: $uploadedFileName")
            article.imageUrl = devUrl + "/" + uploadedFileName
        }
        article.id?.let {
            article.imageUrl?.let { it1 ->
                modifyArticle.execute(
                    id = it,
                    title = article.title,
                    content = article.content,
                    tag = article.tag,
                    image = it1
                )
            }
        }
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