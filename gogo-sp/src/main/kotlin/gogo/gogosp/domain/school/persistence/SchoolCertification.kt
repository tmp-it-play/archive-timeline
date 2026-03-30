package gogo.gogosp.domain.school.persistence

import jakarta.persistence.*

@Entity
@Table(name = "tbl_school_certification")
class SchoolCertification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "school_certification_id")
    val schoolCertificationId: Long = 0,

    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: Long,

    @Column(name = "usage_purpose", nullable = false)
    val usagePurpose: String,

    @Column(name = "proof_document", nullable = false)
    val proofDocument: String,

    @Column(name = "student_card", nullable = false)
    val studentCard: String,

    @Column(name = "is_authentication", nullable = false)
    val isAuthentication: Boolean
) {
}