package comirotod.controller

import comirotod.entity.Board
import comirotod.service.BoardService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.multipart.MultipartFile
import kotlin.math.max
import kotlin.math.min

@Controller
class BoardController @Autowired constructor(private val boardService: BoardService) {
    @GetMapping("/board/write")
    fun boardWriteForm(): String {
        return "boardwrite"
    }
    @PostMapping("/board/writepro")
    @Throws(Exception::class)
    fun boardWritePro(board: Board?, model: Model, file: MultipartFile?): String {
        board?.let { file?.let { it1 -> boardService.write(it, it1) } }
        model.addAttribute("message", "글 작성이 완료되었습니다.")
        model.addAttribute("searchUrl", "/board/list")
        return "message"
    }
    @GetMapping("/board/list")
    fun boardList(
        model: Model,
        @PageableDefault(
            page = 0,
            size = 10,
            sort = ["id"],
            direction = Sort.Direction.DESC
        ) pageable: Pageable?,
        searchKeyword: String?
    ): String {
        val list: Page<Board?>? = if (searchKeyword == null) {
            boardService.boardList(pageable)
        } else {
            boardService.boardSearchList(searchKeyword, pageable)
        }
        val nowPage = list!!.pageable.pageNumber + 1
        val startPage = max((nowPage - 4).toDouble(), 1.0).toInt()
        val endPage = min((nowPage + 5).toDouble(), list.totalPages.toDouble()).toInt()
        model.addAttribute("list", list)
        model.addAttribute("nowPage", nowPage)
        model.addAttribute("startPage", startPage)
        model.addAttribute("endPage", endPage)
        return "boardlist"
    }
    @GetMapping("/board/view")
    fun boardView(model: Model, id: Int?): String {
        model.addAttribute("board", id?.let { boardService.boardView(it) })
        return "boardview"
    }
    @GetMapping("/board/modify/{id}")
    fun boardModify(@PathVariable("id") id: Int?, model: Model): String {
        model.addAttribute("board", id?.let { boardService.boardView(it) })
        return "boardmodify"
    }
    @PostMapping("/board/update/{id}")
    @Throws(Exception::class)
    fun boardUpdate(@PathVariable("id") id: Int?, board: Board, file: MultipartFile?): String {
        val boardTemp: Board? = id?.let { boardService.boardView(it) }
        val updatedBoard = boardTemp?.copy(
            title = board.title,
            content = board.content
        )
        file?.let { updatedBoard?.let { it1 -> boardService.write(it1, it) } }
        return "redirect:/board/list"
    }
}