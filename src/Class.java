public class Class {
}

class Car {
    String brand;
    String color;
    int speed;

    void accelerate(int amount) {
        speed += amount;
    }

    void brake(int amount) {
        if (speed - amount < 0) {
            speed = 0;
        } else {
            speed -= amount;
        }
    }

    void displayInfo() {
        System.out.println("브랜드: " + brand);
        System.out.println("색상: " + color);
        System.out.println("속도: " + speed);
    }
}

class CarTest {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.brand = "Hyundai";
        myCar.color = "Blue";
        myCar.speed = 0;
        myCar.accelerate(20);
        myCar.displayInfo();
        myCar.brake(10);
        myCar.displayInfo();
    }
}