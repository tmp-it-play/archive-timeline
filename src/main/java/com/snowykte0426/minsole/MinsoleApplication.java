package com.snowykte0426.minsole;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MinsoleApplication {

    public static void main(String[] args) {
        SpringApplication.run(MinsoleApplication.class, args);
    }

}
