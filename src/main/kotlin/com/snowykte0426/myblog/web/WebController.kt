package com.snowykte0426.myblog.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.servlet.view.RedirectView

@Controller
class WebController {
    @GetMapping
    fun redirectToMain(): RedirectView {
        return RedirectView("/main")
    }

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