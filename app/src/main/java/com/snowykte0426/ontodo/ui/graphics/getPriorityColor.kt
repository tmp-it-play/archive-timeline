package com.snowykte0426.ontodo.ui.graphics

import androidx.compose.ui.graphics.Color

fun getPriorityColor(level: String): Color {
    return when (level) {
        "UPGRANT" -> Color(0xFFE57373)
        "NORMAL" -> Color(0xFFFFB74D)
        "NOT_UPGRANT" -> Color(0xFF81C784)
        else -> Color.Gray
    }
}