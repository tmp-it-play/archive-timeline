package com.snowykte0426.myblog.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam

@Controller
class WebController {
    @GetMapping("/main")
    fun getMainPage(): String {
        return "mainpage"
    }

    @GetMapping("/post")
    fun getArticlePage(@RequestParam id: Long): String {
        return "postpage"
    }

    @GetMapping("/write")
    fun getWritePage(): String {
        return "writepage"
    }
}