package gogo.gogosp.domain.customer.root.persistence

import jakarta.persistence.*

@Entity
@Table(name = "tbl_customer_inquiry")
class CustomerInquiry(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_inquiry_id", nullable = false)
    val customerInquiryId: Long = 0,

    @Column(name = "student_id", nullable = false, unique = true)
    val studentId: Long,

    @Column(name = "title", nullable = false)
    val title: String,

    @Column(name = "content", nullable = false)
    val content: String,

    @Column(name = "is_reading", nullable = false)
    val isReading: Boolean,
) {
}