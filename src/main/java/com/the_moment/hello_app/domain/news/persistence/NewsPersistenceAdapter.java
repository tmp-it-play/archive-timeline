package com.the_moment.hello_app.domain.news.persistence;

import com.the_moment.hello_app.domain.news.persistence.mapper.NewsMapper;
import com.the_moment.hello_app.domain.news.persistence.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NewsPersistenceAdapter {
    // TODO: port 구현되면 상속받아서 PersistenceAdapter도 구현해야함
    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;


}