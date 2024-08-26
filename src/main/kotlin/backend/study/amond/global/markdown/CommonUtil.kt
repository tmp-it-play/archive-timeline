package backend.study.amond.global.markdown

import org.commonmark.node.Node
import org.commonmark.parser.Parser
import org.commonmark.renderer.html.HtmlRenderer
import org.springframework.stereotype.Component

@Component
class CommonUtil {
    fun markdown(markdown: String): String {
        val parser: Parser = Parser.builder().build()
        val document: Node = parser.parse(markdown)
        val renderer: HtmlRenderer = HtmlRenderer.builder().build()
        return renderer.render(document)
    }
}