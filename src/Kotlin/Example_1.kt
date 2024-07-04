package Kotlin

fun main() {
    val s = readln()
    val i = s.indexOf("/")
    val result = if (i >= 0) {
        val a = s.substring(0, i).toInt()
        val b = s.substring(i + 1).toInt()
        (a / b).toString()
    } else ""
    println(result)
}