package gogo.gogostage.domain.stage.participant.root.persistence

import gogo.gogostage.domain.stage.root.persistence.StageStatus
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query

interface StageParticipantRepository: JpaRepository<StageParticipant, Long> {
    @Query("""
            SELECT sp FROM StageParticipant sp JOIN Stage s ON sp.stage.id = s.id
            WHERE s.id = :stageId AND sp.studentId = :studentId AND s.status = :stageStatus
        """)
    fun queryStudentPoint(stageId: Long, studentId: Long, stageStatus: StageStatus): StageParticipant?

    fun queryStageParticipantByStageIdAndStudentId(stageId: Long, studentId: Long): StageParticipant?

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT sp FROM StageParticipant sp WHERE sp.stage.id = :stageId AND sp.studentId = :studentId")
    fun queryStageParticipantByStageIdAndStudentIdForUpdate(stageId: Long, studentId: Long): StageParticipant?

    fun existsByStageIdAndStudentId(stageId: Long, studentId: Long): Boolean

    fun findByStageIdAndStudentId(stageId: Long, studentId: Long): StageParticipant?
}
