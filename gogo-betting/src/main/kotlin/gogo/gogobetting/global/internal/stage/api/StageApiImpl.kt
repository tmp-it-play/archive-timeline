package gogo.gogobetting.global.internal.stage.api

import gogo.gogobetting.global.feign.client.StageClient
import gogo.gogobetting.global.internal.stage.stub.MatchApiInfo
import gogo.gogobetting.global.internal.stage.stub.StudentPointStub
import org.springframework.stereotype.Component

@Component
class StageApiImpl(
    private val stageClient: StageClient
) : StageApi {
    override fun matchApiInfo(matchLId: Long): MatchApiInfo =
        stageClient.matchApiInfo(matchLId)

    override fun queryStudentPoint(stageId: Long, studentId: Long): StudentPointStub =
        stageClient.queryStudentPoint(stageId, studentId)
}
