package backend.study.amond.domain.markdown.service

import backend.study.amond.global.markdown.LocalMarkdownPath
import org.springframework.core.io.ClassPathResource
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.nio.file.Paths

@Service
class MarkService(private val localMarkdownPath: LocalMarkdownPath) {
    fun getMarkdownValueFromLocal(manualPage: String): String {
        val markdownFilePath = Paths.get(localMarkdownPath.LOCAL_MARKDOWN_PATH(), "$manualPage.md").toString()
        val classPathResource = ClassPathResource(markdownFilePath)
        if (!classPathResource.exists()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Markdown file not found at path: $markdownFilePath")
        }
        return classPathResource.inputStream.bufferedReader().use { it.readText() }
    }
}