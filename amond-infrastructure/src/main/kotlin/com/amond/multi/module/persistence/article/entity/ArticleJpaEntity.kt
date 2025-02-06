package com.amond.multi.module.persistence.article.entity

import com.amond.multi.module.persistence.article.BaseIdxEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "article")
class ArticleJpaEntity(
    @Column(name = "article_idx")
    override val idx: Long?,
    @Column(name = "content")
    val content: String,
    @Column(name = "view_count")
    val viewCount: Long
):BaseIdxEntity(idx)