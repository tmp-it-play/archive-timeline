package gogo.gogosp.domain.customer.root.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface CustomerInquiryRepository: JpaRepository<CustomerInquiry, Long> {
}