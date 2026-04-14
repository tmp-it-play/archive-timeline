package gogo.gogouser.domain.teacher.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface TeacherRepository : JpaRepository<Teacher, Long>
