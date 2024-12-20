package com.snowykte0426.myblog.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class WebController{
    @GetMapping("/main")
    fun getMainPage(): String {
        return "mainpage"
    }

    @GetMapping("/article")
    fun getArticlePage(): String {
        return "postpage"
    }
}