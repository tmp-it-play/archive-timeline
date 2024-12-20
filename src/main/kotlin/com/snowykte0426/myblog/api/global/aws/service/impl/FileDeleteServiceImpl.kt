package com.snowykte0426.myblog.api.global.aws.service.impl

import com.amazonaws.services.s3.AmazonS3
import com.snowykte0426.myblog.api.global.aws.service.FileDeleteService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class FileDeleteServiceImpl(
    @Value("\${aws.s3.bucket}")
    private val bucketName: String,
    private val s3Client: AmazonS3
) : FileDeleteService {
    override fun deleteFile(fileName: String) {
        s3Client.deleteObject(bucketName, fileName)
    }
}