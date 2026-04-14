package gogo.gogouser.domain.school.root.application

import gogo.gogouser.domain.auth.application.dto.AuthSignUpReqDto
import gogo.gogouser.domain.auth.application.dto.SchoolInfoDto
import gogo.gogouser.domain.school.detail.persistence.SchoolDetail
import gogo.gogouser.domain.school.detail.persistence.SchoolDetailRepository
import gogo.gogouser.domain.school.root.persistence.School
import gogo.gogouser.domain.school.root.persistence.SchoolRepository
import org.springframework.stereotype.Component

@Component
class SchoolProcessor(
    private val schoolReader: SchoolReader,
    private val schoolRepository: SchoolRepository,
    private val schoolDetailRepository: SchoolDetailRepository
) {

    fun getSchoolOrCreate(dto: AuthSignUpReqDto): School =
        getSchoolOrCreate(dto.school)

    fun getSchoolOrCreate(schoolInfo: SchoolInfoDto): School =
        schoolReader.readBySdCodeOrNull(schoolInfo.sdCode)
            ?: run {
                val createSchool = School.of(schoolInfo)
                val savedSchool = schoolRepository.save(createSchool)
                val schoolDetail = SchoolDetail.of(createSchool, schoolInfo)
                schoolDetailRepository.save(schoolDetail)
                savedSchool
            }

}
