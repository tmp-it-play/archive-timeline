package gogo.gogobetting.domain.betting.root.application

import gogo.gogobetting.domain.betting.root.persistence.BettingRepository
import gogo.gogobetting.domain.betting.root.persistence.type.BettingStatus
import gogo.gogobetting.global.error.BettingException
import gogo.gogobetting.global.internal.stage.api.StageApi
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component

@Component
class BettingValidator(
    private val bettingRepository: BettingRepository,
    private val stageApi: StageApi,
) {

    fun valid(matchId: Long, studentId: Long, stageId: Long, bettingPoint: Long) {
        val isBet =
            bettingRepository.existsByMatchIdAndStudentIdAndStatus(matchId, studentId, BettingStatus.CONFIRMED)

        if (isBet) {
            throw BettingException("This Match Already Betting, match id = $matchId", HttpStatus.BAD_REQUEST.value())
        }

        val currentPoint = stageApi.queryStudentPoint(stageId, studentId).point
        val inFlightPoint = bettingRepository.sumConfirmedBettingPoint(studentId)
        val availablePoint = currentPoint - inFlightPoint

        if (bettingPoint > availablePoint) {
            throw BettingException(
                "Insufficient point. available = $availablePoint, requested = $bettingPoint",
                HttpStatus.BAD_REQUEST.value()
            )
        }
    }

}