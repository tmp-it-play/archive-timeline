package com.snowykte0426.minsole.domain.page.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping
    public String index() {
        return "index";
    }

    // 최신 모바일 페이지는 MobileController에서 처리함
    // @GetMapping("/mobile")
    // public String mobile() {
    //     return "mobile";
    // }

    // 예전 모바일 페이지 - 이제 새로운 모바일 페이지로 리디렉션
    @GetMapping("/app")
    public String app() {
        return "redirect:/mobile";
    }

    @GetMapping("/figma")
    public String figma() {
        return "figma-mobile";
    }

    @GetMapping("/figma-mobile")
    public String figmaMobile() {
        return "figma-mobile";
    }
}