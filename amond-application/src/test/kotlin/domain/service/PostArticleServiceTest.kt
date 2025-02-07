package domain.service

import com.amond.multi.module.domain.article.Article
import com.amond.multi.module.domain.article.data.dto.ArticleDto
import com.amond.multi.module.domain.article.domain.service.impl.PostArticleServiceImpl
import com.amond.multi.module.persistence.article.entity.ArticleJpaEntity
import com.amond.multi.module.persistence.article.mapper.ArticleMapper
import com.amond.multi.module.persistence.article.repository.ArticleJpaRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.*
import org.mockito.junit.jupiter.MockitoExtension

@ExtendWith(MockitoExtension::class)
class PostArticleServiceTest {

    @Mock
    private lateinit var articleJpaRepository: ArticleJpaRepository

    @Mock
    private lateinit var articleMapper: ArticleMapper

    @InjectMocks
    private lateinit var postArticleService: PostArticleServiceImpl

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.openMocks(this)
    }

    @Test
    fun createArticle() {
        val article = Article(idx = null, content = "test content", viewCount = 0)
        val articleJpaEntity = ArticleJpaEntity(idx = 1L, content = "test content", viewCount = 0)
        val expectedDto = ArticleDto(1L, "test content", 0)
        Mockito.`when`(articleMapper.toEntity(ArgumentMatchers.any<Article>() ?: article))
            .thenReturn(articleJpaEntity)
        Mockito.`when`(articleJpaRepository.save(ArgumentMatchers.any<ArticleJpaEntity>() ?: articleJpaEntity))
            .thenReturn(articleJpaEntity)
        val result = postArticleService.execute("test content")
        assertEquals(expectedDto.id, result.id)
        assertEquals(expectedDto.content, result.content)
        assertEquals(expectedDto.viewCount, result.viewCount)
        Mockito.verify(articleMapper, Mockito.times(1)).toEntity(ArgumentMatchers.any<Article>() ?: article)
        Mockito.verify(articleJpaRepository, Mockito.times(1))
            .save(ArgumentMatchers.any<ArticleJpaEntity>() ?: articleJpaEntity)
    }
}