package backend.study.amond.global.markdown

import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

@Component
class LocalMarkdownPath {
    @Bean
    fun LOCAL_MARKDOWN_PATH(): String {
        return "templates/"
    }
}