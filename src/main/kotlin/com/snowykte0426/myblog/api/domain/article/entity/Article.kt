package com.snowykte0426.myblog.api.domain.article.entity

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
    @Column(nullable = true)
    var imageName: String? = null,
    @Column(nullable = true)
    var imageUrl: String? = null
)