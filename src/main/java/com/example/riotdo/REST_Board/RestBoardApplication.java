package com.example.riotdo.REST_Board;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.riotdo.REST_Board.mapper")
public class RestBoardApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestBoardApplication.class, args);
    }
}