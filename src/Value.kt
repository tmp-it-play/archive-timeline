fun ValandVar() {
    val num1 = readln().toInt()
    val num2 = readln().toInt()
    var num3: Int = num1 + num2
    val num4 = num3
    var eyo: String
    while (num3 >= 10) {
        num3 = num3 % 10
    }
    if (num3 == 2 || num3 == 4 || num3 == 9) {
        eyo = "에요"
    } else {
        eyo = "이에요"
    }
    print("1은" + num4 + eyo)
}