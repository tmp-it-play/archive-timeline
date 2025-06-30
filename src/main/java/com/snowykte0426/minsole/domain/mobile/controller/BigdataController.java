package com.snowykte0426.minsole.domain.mobile.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 빅데이터 맛집 앱 모바일 컨트롤러
 */
@Controller
@RequestMapping("/bigdata")
public class BigdataController {

    @GetMapping
    public String index() {
        return "mobile/bigdata";
    }

    @GetMapping("/map")
    public String map() {
        return "mobile/bigdata";
    }

    @GetMapping("/mypage")
    public String mypage() {
        return "mobile/bigdata";
    }
}
