package gogo.gogosp.domain.school.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface SchoolCertificationRepository: JpaRepository<SchoolCertification, Long> {
}