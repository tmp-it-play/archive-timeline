package com.snowykte0426.ontodo.ui.graphics

import androidx.compose.ui.graphics.Color

fun getPriorityColor(level: Int): Color {
    return when (level) {
        3 -> Color(0xFFE57373) // 빨강 (높음)
        2 -> Color(0xFFFFB74D) // 주황 (보통)
        else -> Color(0xFF81C784) // 초록 (낮음)
    }
}