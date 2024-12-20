package com.snowykte0426.myblog.api.domain.article.entity

import com.snowykte0426.myblog.api.domain.article.presentation.controller.dto.ArticleDto
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "article_table")
data class Article(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(nullable = false, length = 100)
    var title: String,
    @Column(nullable = false, columnDefinition = "TEXT")
    var content: String,
    @Column(nullable = false)
    var tag: String,
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    var createdAt: LocalDateTime = LocalDateTime.now(),
    @Column(nullable = false)
    var viewCount: Long = 0L,
    @Column(nullable = false)
    var imageName: String,
    @Column(nullable = false)
    var imageUrl: String
) {
    fun toDto() = ArticleDto(
        id = id!!,
        title = title,
        content = content,
        tag = tag,
        createdAt = createdAt.toString(),
        viewCount = viewCount,
        imageName = imageName,
        imageUrl = imageUrl
    )
}