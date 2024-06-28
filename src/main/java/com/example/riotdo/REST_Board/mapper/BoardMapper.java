package com.example.riotdo.REST_Board.mapper;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.riotdo.REST_Board.dto.BoardDto;

@Mapper
public interface BoardMapper {
    List<BoardDto> selectBoardList() throws Exception;
}