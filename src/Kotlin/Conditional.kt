package Kotlin

import kotlin.Array

class Conditional {
    fun Max(a: Int, b: Int): Int {
        return if (a < b) {
            b
        } else {
            a
        }
    }

    fun ArrayHello_args(args: Array<String>): String {
        return if (args.isNotEmpty()) {
            val message = "Hello, ${args[0]}"
            message
        } else {
            "Error"
        }
    }
}

fun main(): Unit {
    var n1: Int = readln().toInt()
    var n2: Int = readln().toInt()
    println("$n1 $n2")
    println(Conditional().Max(n1, n2))
    val args = arrayOf("World")
    println(Conditional().ArrayHello_args(args))
}