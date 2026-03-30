package gogo.gogosp.domain.faq.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface FaqRepository: JpaRepository<Faq, Long> {
}