package gogo.gogobetting.domain.betting.root.application.dto

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive

data class BettingDto(
    @field:NotNull
    val predictedWinTeamId: Long,
    @field:Positive
    @field:NotNull
    val bettingPoint: Long
)

data class MatchOddsDto(
    val odds: Double
)

data class BettingBundleDto(
    val bettings: List<BettingBundleInfoDto>
)

data class BettingBundleInfoDto(
    val matchId: Long,
    val betting: BettingInfoDto,
    val result: BettingResultInfoDto?
)

data class BettingInfoDto(
    val bettingId: Long,
    val bettingPoint: Long,
    val predictedWinTeamId: Long,
)

data class BettingResultInfoDto(
    val isPredicted: Boolean,
    val earnedPoint: Long,
)

data class TotalBettingPointDto(
    val bettingPoint: Long,
)
