package Kotlin

import java.util.*

class Calculation {
    fun Bit() {
        var num1: Int = 30
        num1 = num1 shl 2
        var num2: Int = 40
        var num3: Int = 2
        num2 = num2 shr 3
        num3 = num3 shr 100
        println("num1 = $num1  /  num2 = $num2  /  num3 = $num3")
    }

    fun FalseandTrue() {
        println("False and True is True")
        println(Double.NaN == Double.NaN)
        var test: Double = Double.NaN
        println("\n\n\n\n" + test)
        println(Double.NaN < Double.POSITIVE_INFINITY)
    }

    fun Str_bi() {
        println("abs" < "cba")
        println("123" > "34")
        var bool1: Boolean = false
        val str1: String = bool1.toString()
        println(str1)
        val str2: String = "true"
        val bool2: Boolean = str2.toBoolean()
        if (bool2 == true) {
            println("nice!")
        } else {
            println("bed...")
        }
    }
}

fun main() {
    Calculation().Bit()
    Calculation().FalseandTrue()
    String_P().Unicode_Print()
    String_P().Now_Date()
    Calculation().Str_bi()
}

class String_P {
    fun Now_Date() {
        val name = readlnOrNull()
        println("Hello, $name!\nToday is ${Date()}")
    }

    fun Unicode_Print() {
        val text = "Hello, World!\nThis is\"multiline\" string"
        println("\u03C0 \u2248 3.14")
    }
}