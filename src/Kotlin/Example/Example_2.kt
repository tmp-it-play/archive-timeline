package Kotlin.Example

fun main(): Unit {
    val str1 = "Hello,World".substring(1..4)
    println(str1)
    println("Hello,World".substring(1 until 4))
    println("Hello, World".substring(1, 4))
    println(IntArray(10) { it * it }.sliceArray(2..5).joinToString())
    println(IntArray(10) { it * it }.sliceArray(2 until 5).joinToString())
}