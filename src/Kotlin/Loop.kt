package Kotlin

import kotlin.random.Random

class Loop {
    fun do_while() {
        var sum = 0
        do {
            var num: Int = readln().toInt()
            sum += num
        } while (num != 0)
        println(sum)
    }

    fun updown() {
        val num = Random.nextInt(1, 101)
        var guess = 0
        while (guess != num) {
            guess = readln().toInt()
            if (guess > num) println("Too big")
            else if (guess < num) println("Too small")
        }
        println("Right: It's $num")
    }

    fun for_loop() {
        val a = IntArray(10) { it * it }
        var sum = 0
        for (x in a) {
            sum += x
        }
        println("Sum: $sum")
    }

    fun countLetters(text: String): IntArray {
        val count = IntArray('z' - 'a' + 1)
        for (char in text) {
            val charLower = char.lowercaseChar()
            if (charLower !in 'a'..'z') continue
            count[charLower - 'a']++
        }
        return count
    }
}

fun main() {
    Loop().do_while()
    Loop().updown()
    Loop().for_loop()
    val str1: String = readln().toString()
    println(Loop().countLetters(str1))
}