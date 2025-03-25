package com.snowykte0426.minsole.domain.data.repository;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataJpaRepository extends JpaRepository<DataJpaEntity, Long> {
}