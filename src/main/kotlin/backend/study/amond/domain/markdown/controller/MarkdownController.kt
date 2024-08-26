package backend.study.amond.domain.markdown.controller

import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import kotlin.reflect.jvm.internal.impl.descriptors.Visibilities.Private

@Controller
class MarkdownController {

    @GetMapping
    fun normal(): String {
        return "redirect:"
    }

    @GetMapping("/view/{page}")
    fun markdownView(@PathVariable("page") page: String, model: Model): String {
        val markdownValueFormLocal: String = getMarkdownValueFormLocal
        // 추가적인 처리 로직 필요
        return "markdownView"
    }
}