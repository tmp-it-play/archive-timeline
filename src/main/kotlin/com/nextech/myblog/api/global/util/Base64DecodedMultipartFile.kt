package com.nextech.myblog.api.global.util

import org.springframework.web.multipart.MultipartFile
import java.io.ByteArrayInputStream
import java.io.InputStream
import java.util.*

class Base64DecodedMultipartFile(
    private val content: ByteArray,
    private val contentType: String
) : MultipartFile {
    override fun getInputStream(): InputStream = ByteArrayInputStream(content)
    override fun getName(): String = UUID.randomUUID().toString()
    override fun getOriginalFilename(): String = "${UUID.randomUUID()}.jpg"
    override fun getContentType(): String = contentType
    override fun isEmpty(): Boolean = content.isEmpty()
    override fun getSize(): Long = content.size.toLong()
    override fun getBytes(): ByteArray = content
    override fun transferTo(dest: java.io.File) {
        dest.writeBytes(content)
    }
}