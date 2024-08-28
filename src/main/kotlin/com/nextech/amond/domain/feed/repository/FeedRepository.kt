package com.nextech.amond.domain.feed.repository

import com.nextech.amond.domain.feed.entity.Feed
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FeedRepository : JpaRepository<Feed, Long> {
    @Query("SELECT f FROM Feed f ORDER BY RAND() LIMIT 1")
    fun findRandomFeed(): Feed?
}