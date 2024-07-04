package Kotlin

class Array {
    fun array_pratice1() {
        var array_pra = IntArray(11)
        for (i in 1..10) {
            array_pra[i] = i
        }
        println(array_pra.joinToString())
    }

    fun array_pratice2() {
        val operations = charArrayOf('+', '-', '*', '/', '%')
        val squares = IntArray(10) { (it + 1) * (it + 1) }
        println(operations.joinToString())
        println(squares.joinToString())
    }

    fun array_pratice3() {
        val arr1 = shortArrayOf(5, 4, 2, 1, 3)
        val arr2 = shortArrayOf(1, 4, 2, 1, 3)
        val bool: Boolean = arr1.contentEquals(arr2)
        println(bool)
        println(arr2.indexOf(3))
    }
}

fun main() {
    Array().array_pratice1()
    print("\n\n\n\n")
    Array().array_pratice2()
    print("\n\n\n")
    Array().array_pratice3()
}