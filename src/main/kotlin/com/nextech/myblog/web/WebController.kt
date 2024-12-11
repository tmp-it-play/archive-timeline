package com.nextech.myblog.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class WebController{
    @GetMapping("/main")
    fun getMainPage(): String {
        return "mainpage"
    }
}