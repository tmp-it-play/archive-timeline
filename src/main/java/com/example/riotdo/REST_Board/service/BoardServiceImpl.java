package com.example.riotdo.REST_Board.service;

import com.example.riotdo.REST_Board.dto.BoardDto;
import com.example.riotdo.REST_Board.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardServiceImpl implements BoardService {

    @Autowired
    private BoardMapper boardMapper;

    @Override
    public List<BoardDto> selectBoardList() throws Exception {
        return boardMapper.selectBoardList();
    }

    public void insertBoard(BoardDto board) throws Exception {
        boardMapper.insertBoard(board);
    }
}