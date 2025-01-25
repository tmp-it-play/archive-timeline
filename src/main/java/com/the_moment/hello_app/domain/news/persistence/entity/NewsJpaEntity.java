package com.the_moment.hello_app.domain.news.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "news")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsJpaEntity {

    @Id
    private String id;
    @ElementCollection
    @CollectionTable(name = "news_sections", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "section")
    private List<String> sections;
    private String title;
    private String publisher;
    private String author;
    @Lob
    private String summary;
    private String imageUrl;
    private String thumbnailUrl;
    private String contentUrl;
    private LocalDateTime publishedAt;
    @Lob
    private String body;
    @ElementCollection
    @CollectionTable(name = "news_companies", joinColumns = @JoinColumn(name = "news_id"))
    private List<CompanyJpaEntity> companies;
    @ElementCollection
    @CollectionTable(name = "news_entities", joinColumns = @JoinColumn(name = "news_id"))
    private List<EntityJpaEntity> entities;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class CompanyJpaEntity {
        private String name;
        private String symbol;
        private String exchange;
        private String sentiment;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Embeddable
    public static class EntityJpaEntity {
        private String type;
        private String name;
    }
}