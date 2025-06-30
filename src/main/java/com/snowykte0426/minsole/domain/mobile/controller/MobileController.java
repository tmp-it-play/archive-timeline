package com.snowykte0426.minsole.domain.mobile.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mobile")
public class MobileController {

    @GetMapping
    public String splash() {
        return "mobile/splash";
    }

    @GetMapping("/login")
    public String login() {
        return "mobile/login";
    }

    @GetMapping("/main")
    public String main() {
        return "mobile/main";
    }

    @GetMapping("/map")
    public String map() {
        return "mobile/map";
    }

    @GetMapping("/mypage")
    public String mypage() {
        return "mobile/mypage";
    }
}
