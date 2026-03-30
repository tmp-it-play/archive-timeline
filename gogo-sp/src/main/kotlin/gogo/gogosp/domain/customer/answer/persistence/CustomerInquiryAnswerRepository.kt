package gogo.gogosp.domain.customer.answer.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface CustomerInquiryAnswerRepository: JpaRepository<CustomerInquiryAnswer, Long> {
}