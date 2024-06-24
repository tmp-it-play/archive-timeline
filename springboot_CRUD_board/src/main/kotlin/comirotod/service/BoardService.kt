package comirotod.service

import comirotod.entity.Board
import comirotod.repository.BoardRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.util.*

@Service
class BoardService @Autowired constructor(
    private val boardRepository: BoardRepository
) {
    @Throws(Exception::class)
    fun write(board: Board, file: MultipartFile) {
        val projectPath = System.getProperty("user.dir") + "\\src\\main\\resources\\static\\img"
        val uuid = UUID.randomUUID()
        val fileName = uuid.toString() + "_" + file.originalFilename
        val saveFile = File(projectPath, fileName)
        file.transferTo(saveFile)
        board.filename = fileName
        board.filepath = "/img/$fileName"
        boardRepository.save(board)
    }
    fun boardList(pageable: Pageable?): Page<Board?> {
        return boardRepository.findAll(pageable!!)
    }
    fun boardSearchList(searchKeyword: String?, pageable: Pageable?): Page<Board?>? {
        return boardRepository.findByTitleContaining(searchKeyword!!, pageable!!)
    }
    fun boardView(id: Int): Board? {
        return boardRepository.findById(id).orElseThrow { RuntimeException("Board not found") }
    }
}