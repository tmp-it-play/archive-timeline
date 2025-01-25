package com.the_moment.hello_app.domain.news.persistence.mapper;

import com.the_moment.hello_app.domain.news.domain.News;
import com.the_moment.hello_app.domain.news.persistence.entity.NewsJpaEntity;
import com.the_moment.hello_app.global.mapper.GenericMapper;
import org.springframework.stereotype.Component;

@Component
public class NewsMapper implements GenericMapper<NewsJpaEntity,News> {
    @Override
    public NewsJpaEntity toEntity(News domain) {
        return NewsJpaEntity.builder()
                .id(domain.getId())
                .title(domain.getTitle())
                .author(domain.getAuthor())
                .entities(domain.getEntities().stream().map(this::toEntityJpaEntity).toList())
                .companies(domain.getCompanies().stream().map(this::toCompanyJpaEntity).toList())
                .contentUrl(domain.getContentUrl())
                .sections(domain.getSections())
                .publishedAt(domain.getPublishedAt())
                .imageUrl(domain.getImageUrl())
                .thumbnailUrl(domain.getThumbnailUrl())
                .publisher(domain.getPublisher())
                .summary(domain.getSummary())
                .body(domain.getBody())
                .build();
    }

    @Override
    public News toDomain(NewsJpaEntity entity) {
        return News.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .author(entity.getAuthor())
                .entities(entity.getEntities().stream().map(this::toEntity).toList())
                .companies(entity.getCompanies().stream().map(this::toCompany).toList())
                .contentUrl(entity.getContentUrl())
                .sections(entity.getSections())
                .publishedAt(entity.getPublishedAt())
                .imageUrl(entity.getImageUrl())
                .thumbnailUrl(entity.getThumbnailUrl())
                .publisher(entity.getPublisher())
                .summary(entity.getSummary())
                .body(entity.getBody())
                .build();
    }

    private NewsJpaEntity.CompanyJpaEntity toCompanyJpaEntity(News.Company company) {
        return new NewsJpaEntity.CompanyJpaEntity(
                company.getName(),
                company.getSymbol(),
                company.getExchange(),
                company.getSentiment()
        );
    }

    private NewsJpaEntity.EntityJpaEntity toEntityJpaEntity(News.Entity entity) {
        return new NewsJpaEntity.EntityJpaEntity(
                entity.getType(),
                entity.getName()
        );
    }

    private News.Company toCompany(NewsJpaEntity.CompanyJpaEntity companyJpaEntity) {
        return News.Company.builder()
                .name(companyJpaEntity.getName())
                .symbol(companyJpaEntity.getSymbol())
                .exchange(companyJpaEntity.getExchange())
                .sentiment(companyJpaEntity.getSentiment())
                .build();
    }

    private News.Entity toEntity(NewsJpaEntity.EntityJpaEntity entityJpaEntity) {
        return News.Entity.builder()
                .type(entityJpaEntity.getType())
                .name(entityJpaEntity.getName())
                .build();
    }
}