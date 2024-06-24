package comirotod.repository

import comirotod.entity.Board
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BoardRepository : JpaRepository<Board?, Int?> {
    fun findByTitleContaining(searchKeyword: String?, pageable: Pageable?): Page<Board?>?
}