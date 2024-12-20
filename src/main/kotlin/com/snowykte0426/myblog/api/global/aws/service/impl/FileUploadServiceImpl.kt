package com.snowykte0426.myblog.api.global.aws.service.impl

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import com.snowykte0426.myblog.api.global.aws.service.FileUploadService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*

@Service
class FileUploadServiceImpl(
    @Value("\${aws.s3.bucket}")
    private val bucketName: String,
    @Value("\${aws.s3.dev-url}")
    private val devUrl: String,
    private val s3Client: AmazonS3
) : FileUploadService {
    override fun uploadFile(file: MultipartFile): Pair<String, String> {
        val fileName = "${UUID.randomUUID()}-${file.originalFilename}"
        val metadata = ObjectMetadata().apply {
            contentLength = file.size
            contentType = file.contentType
        }
        s3Client.putObject(bucketName, fileName, file.inputStream, metadata)
        return Pair("$devUrl/$fileName", fileName)
    }
}