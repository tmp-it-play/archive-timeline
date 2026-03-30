package gogo.gogosp.global.internal.student.api

import gogo.gogosp.global.internal.student.stub.StudentByIdStub

interface StudentApi {
    fun queryByUserId(userId: Long): StudentByIdStub
}