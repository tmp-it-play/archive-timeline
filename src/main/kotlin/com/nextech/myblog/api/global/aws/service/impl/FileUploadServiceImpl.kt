package com.nextech.myblog.api.global.aws.service.impl

import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import com.nextech.myblog.api.global.aws.service.FileUploadService
import org.springframework.beans.factory.annotation.Value
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.util.*
import java.util.concurrent.CompletableFuture

@Service
class FileUploadServiceImpl(
    @Value("\${aws.s3.bucket}")
    private val bucketName: String,
    private val s3Client: AmazonS3
) : FileUploadService {
    @Async
    override fun uploadFile(file: MultipartFile): CompletableFuture<Pair<String, String>> {
        val fileName: String = UUID.randomUUID().toString() + "-" + file.originalFilename
        val fileObject = ObjectMetadata()
        fileObject.setContentLength(file.size)
        s3Client.putObject(
            bucketName,
            fileName,
            file.inputStream,
            fileObject
        )
        return CompletableFuture.completedFuture(Pair(s3Client.getUrl(bucketName, fileName).toString(), fileName))
    }
}