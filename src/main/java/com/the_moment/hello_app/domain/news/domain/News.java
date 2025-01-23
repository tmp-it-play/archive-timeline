package com.the_moment.hello_app.domain.news.domain;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;
import java.util.List;

@Value
@Builder
public class News {
    String id;
    List<String> sections;
    String title;
    String publisher;
    String author;
    String summary;
    String imageUrl;
    String thumbnailUrl;
    String contentUrl;
    LocalDateTime publishedAt;
    List<Company> companies;
    List<Entity> entities;
    String body;

    @Value
    @Builder
    public static class Company {
        String name;
        String symbol;
        String exchange;
        String sentiment;
    }

    @Value
    @Builder
    public static class Entity {
        String type;
        String name;
    }
}