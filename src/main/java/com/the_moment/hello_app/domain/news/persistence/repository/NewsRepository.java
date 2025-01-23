package com.the_moment.hello_app.domain.news.persistence.repository;

import com.the_moment.hello_app.domain.news.persistence.entity.NewsJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<NewsJpaEntity, String> {

}