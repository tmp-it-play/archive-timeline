package com.snowykte0426.myblog.api.global.util.markdown

import com.vladsch.flexmark.html.HtmlRenderer
import com.vladsch.flexmark.parser.Parser

object RenderMarkdownToHtml {
    private val parser = Parser.builder().build()
    private val renderer = HtmlRenderer.builder().build()
    fun renderMarkdownToHtml(markdown: String): String {
        val document = parser.parse(markdown)
        return renderer.render(document)
    }
}