import kotlin.math.PI

class Function {
    fun circleArea(radius: Double): Double {
        return PI * radius * radius
    }

    fun rectangleArea(width: Double, height: Double): Double = width * height
}

fun main() {
    print("Enter radius: ")
    val radius = readln().toDouble()
    println("Circle area: ${Function().circleArea(radius)}")
    println()
    val w = readln().toDouble()
    val h = readln().toDouble()
    println("Rectangle area: ${Function().rectangleArea(height = h, width = w)}")
}