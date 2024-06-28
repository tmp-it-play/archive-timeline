package com.example.riotdo.REST_Board.configuration;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
class BoardApplicationTests {

    @Autowired
    private SqlSessionTemplate sqlSession;

    @Test
    void contextLoads() {
    }

    @Test
    public void testSqlSession() throws Exception{
        System.out.println(sqlSession.toString());
    }
}