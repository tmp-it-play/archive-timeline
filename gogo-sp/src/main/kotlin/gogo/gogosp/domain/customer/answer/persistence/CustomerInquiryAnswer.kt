package gogo.gogosp.domain.customer.answer.persistence

import jakarta.persistence.*

@Entity
@Table(name = "tbl_customer_inquiry_answer")
class CustomerInquiryAnswer(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_inquiry_answer_id")
    val customerInquiryAnswerId: Long = 0,

    @Column(name = "customer_inquiry_id", nullable = false, unique = true)
    val customerInquiryId: Long,

    @Column(name = "userId", nullable = false, unique = true)
    val userId: Long,

    @Column(name = "answer", nullable = false)
    val answer: String
) {
}