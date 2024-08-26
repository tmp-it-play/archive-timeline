package backend.study.amond.domain.markdown.controller

import backend.study.amond.domain.markdown.service.MarkService
import org.commonmark.parser.Parser
import org.commonmark.renderer.html.HtmlRenderer
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable

@Controller
class MarkdownController(private val markService: MarkService) {

    @GetMapping
    fun normal(): String {
        return "redirect:/view/main"
    }

    @GetMapping("/view/{page}")
    fun markdownView(@PathVariable("page") page: String, model: Model): String {
        val markdownValueFromLocal = markService.getMarkdownValueFromLocal(page)
        val parser: Parser = Parser.builder().build()
        val document = parser.parse(markdownValueFromLocal)
        val renderer = HtmlRenderer.builder().build()
        model.addAttribute("contents", renderer.render(document))
        return "view"
    }
}