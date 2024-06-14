package sec06;

import java.util.Scanner;

class Circle {
	final double PI = 3.14159;
	double radius;
	double findArea() {
		return radius * radius * PI;
	}
	void show(double x, double y) {
		System.out.printf("반지름 = %.0f,넓이 = %.1f\n", x, y);
	}
}

public class radius {
	public static void main(String[] args) {
		Circle myCircle = new Circle();
		Scanner in = new Scanner(System.in);
		myCircle.radius = in.nextInt();
		myCircle.show(myCircle.radius, myCircle.findArea());
	}
}
