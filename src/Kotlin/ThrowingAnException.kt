package Kotlin

fun parseIntNumber(s: String): Int {
    var num = 0
    if (s.length !in 1..31) throw NumberFormatException("Not a number: $s")
    for (c in s) {
        if (c !in '0'..'1') throw NumberFormatException("Not a number: $s")
        num = num * 2 + (c - '0')
    }
    return num
}

fun DivisionError() {
    try {
        val num1 = readln().toInt()
        val num2 = readln().toInt()
        val result = num1 / num2
        println("Result: $result")

    } catch (e: ArithmeticException) {
        println("Error: You cannot divide by zero.")
    } catch (e: NumberFormatException) {
        println("Error: Please enter valid numbers.")
    }
}

fun READINT(default: Int) = try {
    readln().toInt()
} catch (e: NumberFormatException) {
    default
}

fun Finally(default: Int) = try {
    readln().toInt()
} finally {
    println("Error")
}

fun main() {
    val num1 = readln().toInt()
    //parseIntNumber(Str1)
    DivisionError()
    READINT(num1)
    Finally(num1)
    return
}