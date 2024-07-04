package Kotlin

import kotlin.math.PI

class Function {
    fun circleArea(radius: Double): Double {
        return PI * radius * radius
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
}

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
}