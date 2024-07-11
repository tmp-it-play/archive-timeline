package com.example.riotdo.REST_Board.domain.boards;

import com.example.riotdo.REST_Board.Entity.User;
import com.example.riotdo.REST_Board.domain.boards.BoardDto;
import com.example.riotdo.REST_Board.domain.users.User;
import com.example.riotdo.REST_Board.dto.BoardDto;
import com.example.riotdo.REST_Board.global.Response;
import com.example.riotdo.REST_Board.repository.UserRepository;
import com.example.riotdo.REST_Board.response.Response;
import com.example.riotdo.REST_Board.service.BoardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Board Controller", description = "게시판 관리 API")
@RequestMapping("/boards")
public class BoardController {
    private final BoardService boardService;
    private final UserRepository userRepository;

    @Operation(summary = "전체 게시글 조회", description = "전체 게시글을 조회한다")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("")
    public Response getBoards() {
        return new Response("성공", "전체 게시물 반환", boardService.getBoards());
    }

    @Operation(summary = "개별 게시글 조회", description = "개별 게시글을 조회한다")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}")
    public Response getBoard(@PathVariable("id") Integer id) {
        return new Response("성공", "개별 게시물 반환", boardService.getBoard(id));
    }

    @Operation(summary = "게시글 작성", description = "게시글을 작성한다")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("") // POST /boards?userId=1
    public Response write(@RequestBody BoardDto boardDto, @RequestParam("userId") int userId) {
        User user = userService.findUser(userId);
        return new Response("성공", "글 작성 성공", boardService.write(boardDto, user));
    }

    @Operation(summary = "게시글 수정", description = "게시글을 수정한다")
    @ResponseStatus(HttpStatus.OK)
    @PutMapping("/{id}") // PUT /boards/1?userId=1
    public Response edit(@RequestBody BoardDto boardDto, @PathVariable("id") Integer id, @RequestParam("userId") int userId)
        User user = userService.findUser(userId);
        return new Response("성공", "글 수정 성공", boardService.update(id, boardDto));
    }

    @Operation(summary = "게시글 삭제", description = "게시글을 삭제한다")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{id}") // DELETE /boards/1
    public Response delete(@PathVariable("id") Integer id) {
        boardService.delete(id);
        return new Response("성공", "글 삭제 성공", null);
    }
}