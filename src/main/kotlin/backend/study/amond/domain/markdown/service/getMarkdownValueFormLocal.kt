package backend.study.amond.domain.markdown.service

import backend.study.amond.global.markdown.LocalMarkdownPath
import org.springframework.core.io.ClassPathResource
import java.io.BufferedReader
import java.nio.file.Files
import java.nio.file.Paths

class getMarkdownValueFormLocal(private val localMarkdownPath: LocalMarkdownPath) {
    fun getMarkdownValueFormLocal(manualPage: String): String {
        val stringBuilder: StringBuilder = StringBuilder()
        val classPathResource: ClassPathResource =
            ClassPathResource(localMarkdownPath.LOCAL_MARKDOWN_PATH() + manualPage)
        val br: BufferedReader = Files.newBufferedReader(Paths.get(classPathResource.getURI()))
        br.lines().forEach { line -> stringBuilder.append(line).append('\n') }
        return stringBuilder.toString()
    }
}