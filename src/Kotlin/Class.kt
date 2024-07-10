package Kotlin

class Person {
    var firstName: String = ""
    var familyName: String = ""
    var age: Int = 0
    fun fullName() = "$familyName $firstName"
    fun showMe() {
        println("${fullName()}: $age")
    }
}

class Person_this {
    var firstName: String = ""
    var familyName: String = ""
    var fullName: String = ""
    fun setName(firstName: String, familyName: String) {
        this.firstName = firstName
        this.familyName = familyName
        fullName = this.firstName + " " + this.familyName
        printName()
    }

    fun printName(): Unit {
        println("Name: $fullName")
    }
}

fun main() {
    val name1: String = readln().toString()
    val name2: String = readln().toString()
    Person_this().setName(name1, name2)
    Person().firstName = "John"
    Person().familyName = "Doe"
    Person().age = 25
    Person().showMe()
}