package com.example.riotdo.REST_Board.service;

import com.example.riotdo.REST_Board.dto.BoardDto;
import java.util.List;

public interface BoardService {
    List<BoardDto> selectBoardList() throws Exception;
}