package gogo.gogosp.domain.faq.persistence

import jakarta.persistence.*

@Entity
@Table(name = "tbl_faq")
class Faq(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id")
    val faqId: Long = 0,

    @Column(name = "question", nullable = false)
    val question: String,

    @Column(name = "answer", nullable = false)
    val answer: String
) {
}