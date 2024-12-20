package com.snowykte0426.myblog.api.global.aws.service

import org.springframework.web.multipart.MultipartFile
import java.util.concurrent.CompletableFuture

interface FileUploadService {
    fun uploadFile(file: MultipartFile): Pair<String, String>
}