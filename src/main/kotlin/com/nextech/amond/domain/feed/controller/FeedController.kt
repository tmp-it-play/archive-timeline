package com.nextech.amond.domain.feed.controller

import com.nextech.amond.domain.feed.dto.response.FeedResponse
import com.nextech.amond.domain.feed.entity.Feed
import com.nextech.amond.domain.feed.repository.FeedRepository
import com.nextech.amond.domain.feed.service.FeedService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/feed")
class FeedController(
    private val repository: FeedRepository,
    private val feedService: FeedService
) {

    @GetMapping("/random")
    fun randomFeed(): Feed? {
        return repository.findRandomFeed()
    }

    @PostMapping
    fun postFeed(
        @RequestParam("title") title: String,
        @RequestParam("content") content: String,
        @RequestParam("picture") picture: MultipartFile?
    ): ResponseEntity<FeedResponse> {
        val response = feedService.createFeed(title, content, picture)
        return ResponseEntity.ok(response)
    }
}
