class Array {
    fun array_pratice1() {
        var array_pra = IntArray(11)
        for (i in 1..10) {
            array_pra[i] = i
        }
        println(array_pra.joinToString())
    }
}

fun main() {
    Array().array_pratice1()
}