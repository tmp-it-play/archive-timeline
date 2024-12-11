package com.nextech.myblog.api.global.aws.service

import org.springframework.web.multipart.MultipartFile
import java.util.concurrent.CompletableFuture

interface FileUploadService {
    fun uploadFile(file: MultipartFile): CompletableFuture<Pair<String, String>>
}