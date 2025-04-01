package com.snowykte0426.minsole.domain.data.repository;

import com.snowykte0426.minsole.domain.data.entity.DataJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DataJpaRepository extends JpaRepository<DataJpaEntity, Long> {
    List<DataJpaEntity> findByBizNameContaining(String bizName);
}