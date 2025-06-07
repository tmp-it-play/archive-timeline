package com.snowykte0426.minsole.domain.page.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping
    public String index() {
        return "index";
    }

    @GetMapping("/mobile")
    public String mobile() {
        return "mobile";
    }

    @GetMapping("/app")
    public String app() {
        return "mobile";
    }
}