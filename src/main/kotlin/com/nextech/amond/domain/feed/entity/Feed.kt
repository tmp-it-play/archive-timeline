package com.nextech.amond.domain.feed.entity

import jakarta.persistence.*

@Entity
@Table(name = "feed")
data class Feed(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long = 0,
    @Column(name = "title", nullable = true) var title: String? = null,
    @Column(name = "content", nullable = true) var content: String? = null,
    @Column(name = "picture_url") var pictureUrl: String? = null,
)