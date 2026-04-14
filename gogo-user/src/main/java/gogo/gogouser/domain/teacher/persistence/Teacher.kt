package gogo.gogouser.domain.teacher.persistence

import gogo.gogouser.domain.auth.application.dto.AuthTeacherSignUpReqDto
import gogo.gogouser.domain.school.root.persistence.School
import gogo.gogouser.domain.user.persistence.User
import jakarta.persistence.*

@Entity
@Table(name = "tbl_teacher")
class Teacher(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val id: Long = 0,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    val user: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", nullable = false)
    val school: School,

    @Column(name = "device_token", nullable = true)
    val deviceToken: String?,
) {
    companion object {
        fun of(user: User, school: School, dto: AuthTeacherSignUpReqDto) =
            Teacher(user = user, school = school, deviceToken = dto.deviceToken)
    }
}
