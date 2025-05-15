package com.the_moment.hello_app.domain.news.persistence;

import com.the_moment.hello_app.domain.news.application.port.NewsPersistencePort;
import com.the_moment.hello_app.domain.news.persistence.mapper.NewsMapper;
import com.the_moment.hello_app.domain.news.persistence.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NewsPersistenceAdapter implements NewsPersistencePort {
    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    @Override
    public void testMethod() {
        System.out.println("Wow 친구들 빡빡이 아저씨야");
    }
}