package com.snowykte0426.minsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@EnableFeignClients(basePackages = "com.snowykte0426.minsole.domain.search.service.util")
public class MinsoleApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinsoleApplication.class, args);
    }

}
