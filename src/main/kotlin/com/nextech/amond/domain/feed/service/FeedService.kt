package com.nextech.amond.domain.feed.service

import com.nextech.amond.domain.feed.dto.response.FeedResponse
import com.nextech.amond.domain.feed.entity.Feed
import com.nextech.amond.domain.feed.repository.FeedRepository
import com.nextech.amond.global.aws.service.FileUploadService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile

@Service
class FeedService(
    private val repository: FeedRepository,
    private val fileUploadService: FileUploadService
) {

    @Value("\${AWS_S3_BUCKET}")
    private lateinit var bucketName: String

    fun createFeed(title: String, content: String, picture: MultipartFile?): FeedResponse {
        val pictureUrl = picture?.let {
            fileUploadService.uploadFile(it, bucketName)
        }
        val feed = Feed(title = title, content = content, pictureUrl = pictureUrl)
        val savedFeed = repository.save(feed)
        return FeedResponse(
            id = savedFeed.id,
            title = savedFeed.title ?: "",
            content = savedFeed.content ?: "",
            pictureUrl = savedFeed.pictureUrl ?: ""
        )
    }
}