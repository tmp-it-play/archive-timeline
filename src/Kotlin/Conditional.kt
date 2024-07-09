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

    fun Max(a: Long, b: Long): Long = if (a > b) a else b

    fun ArrayHello_args(args: Array<String>): String {
        return if (args.isNotEmpty()) {
            val message = "Hello, ${args[0]}"
            message
        } else {
            "Error"
        }
    }

    fun hexDigit_1(n: Int): Char {
        when {
            n in 0..9 -> return '0' + n
            n in 10..15 -> return 'A' + n - 10
            else -> return '?'
        }
    }

    fun hexDigit_2(n: Int): Char = when (n) {
        in 0..9 -> '0' + n
        in 10..15 -> 'A' + n - 10
        else -> '?'
    }

    fun numberDescription(n: Int, max: Int = 100): String = when (n) {
        0 -> "Zero"
        in 1..3 -> "Small"
        in 4..9 -> "Medium"
        in 10..100 -> "Large"
        !in Int.MIN_VALUE until 0 -> "Negative"
        else -> "Huge"
    }
}

fun main(): Unit {
    var n1: Int = readln().toInt()
    var n2: Int = readln().toInt()
    println("$n1 $n2")
    println(Conditional().Max(n1, n2))
    val args = arrayOf("World")
    println(Conditional().ArrayHello_args(args))
    n1 = readln().toInt()
    n2 = readln().toInt()
    println("$n1 $n2")
    println(Conditional().Max(n1.toLong(), n2.toLong()))
    Function().puts()
    val a = readln().toInt()
    println(Conditional().hexDigit_1(a))
    println(Conditional().hexDigit_2(a))
    println(Conditional().numberDescription(a))
}