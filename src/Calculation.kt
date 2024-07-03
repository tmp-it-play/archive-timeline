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
}

fun main() {
    Calculation().Bit()
    Calculation().FalseandTrue()
}