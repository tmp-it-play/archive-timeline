package com.example.riotdo.REST_Board.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardDto {
    private int boardIdx;
    private String title;
    private String contents;
    private int hitCnt;
    private String creatorId;
    private LocalDateTime createdDatetime;
    private String updaterId;
    private LocalDateTime updatedDatetime;
}