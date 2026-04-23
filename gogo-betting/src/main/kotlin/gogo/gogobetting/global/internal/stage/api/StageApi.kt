package gogo.gogobetting.global.internal.stage.api

import gogo.gogobetting.global.internal.stage.stub.MatchApiInfo
import gogo.gogobetting.global.internal.stage.stub.StudentPointStub

interface StageApi {
    fun matchApiInfo(matchLId: Long): MatchApiInfo
    fun queryStudentPoint(stageId: Long, studentId: Long): StudentPointStub
}
