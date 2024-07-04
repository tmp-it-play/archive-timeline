package Kotlin

import kotlin.math.PI as 원주율

class Function {
    fun circleArea(radius: Double): Double {
        return 원주율 * radius * radius
    }

    fun rectangleArea(width: Double, height: Double): Double = width * height

    fun printSort(arr: IntArray): Unit {
        val arrs: IntArray = arr.copyOf()
        arrs.sort()
        println(arrs.joinToString(", "))
    }

    fun puts(vararg Str: String): Unit {
        println(Str.joinToString(", "))
    }

    fun Max_Min_Value(): Unit {
        println(Int.MAX_VALUE.toString() + " " + Int.MIN_VALUE.toString())
        println(Short.MIN_VALUE.toString() + " " + Byte.MAX_VALUE.toString())
    }
}

fun readInt(radix: Int = 10) = readln().toInt(radix)

fun main() {
    print("Enter radius: ")
    val radius = readln().toDouble()
    println("Circle area: ${Function().circleArea(radius)}")
    println()
    val w = readln().toDouble()
    val h = readln().toDouble()
    println("Rectangle area: ${Function().rectangleArea(height = h, width = w)}")
    Function().puts(" ")
    val a = intArrayOf(1, 231, 1, 23, 4, 5)
    Function().printSort(a)
    Array().array_pratice1()
    Calculation().FalseandTrue()
    val num: Int = readln().toInt()
    println(num)
    println(readInt())
    Function().puts(" ")
    Function().Max_Min_Value()
    foo().foo()
}

class foo{
    fun foo():Unit{
        println("This is foo")
    }
}