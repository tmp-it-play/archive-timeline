package gogo.gogobetting.global.internal.stage.stub

import java.time.LocalDateTime

data class MatchApiInfo(
    val startDate: LocalDateTime,
    val endDate: LocalDateTime,
    val stage: StageApiInfoDto
)

data class StageApiInfoDto(
    val stageId: Long,
    val maintainers: List<Long>
)

data class StudentPointStub(
    val point: Long
)
