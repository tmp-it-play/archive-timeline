package Java_study;

import java.util.Scanner;

class old_object_aim {
    double radius = 2.0;

    public static void object_study1(String[] agrs) {

        String 출력문 = null;
        System.out.printf("getVolume 매서드에서 반환 받은 값: %s", getVolume(출력문));
    }

    public static String getVolume(String methon2) {
        Scanner in = new Scanner(System.in);
        methon2 = in.next();
        return methon2;
    }
}

class Phone {
    String model;
    int value;

    void print() {
        System.out.println(value + "만 원짜리 " + model + " 스마트폰");
    }
}

class Object_Phone_ex_ {
    public static void Phone_ex(String[] args) {
        Phone myPhone = new Phone();
        myPhone.model = "갤럭시 S8";
        myPhone.value = 100;
        myPhone.print();

        Phone yourPhone = new Phone();
        yourPhone.model = "G6";
        yourPhone.value = 85;
        yourPhone.print();
    }
}

public class object_aim {
    public static void not_main(String[] args) {
        Scanner in = new Scanner(System.in);
        short CHECKER = 0, WHILE_CHECKING = 1;
        wear_list new_wear = new wear_list();
        do {
            CHECKER = wear_list.initialization(CHECKER);
            System.out.print("추가하실 기기의 정보를 입력해주세요\n이름: ");
            new_wear.model = in.next();
            System.out.print("가격: ");
            new_wear.price = in.nextInt();
            System.out.print("출시연도: ");
            new_wear.launch_year = in.nextInt();
            System.out.println("입력이 완료되었습니다");
            new_wear.Print();
            System.out.println("계속입력하시겠습니까?[Y=0/N=1]");
            CHECKER = in.nextShort();
            switch (CHECKER) {
                case 0:
                    WHILE_CHECKING++;
                case 1:
                    break;
            }
        } while (WHILE_CHECKING > 1);
    }
}

class wear_list {
    String model;
    int price, launch_year;

    static short initialization(short Var) {
        Var = 0;
        return Var;
    }

    void Print() {
        System.out.println("\n------------------------");
        System.out.printf("이름:%s\n가격:%d\n출시연도:%d\n", model, price, launch_year);
        System.out.println("------------------------");
    }
}

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

class CircleDemo {
    public static void Circle_main(String[] args) {
        Circle myCircle = new Circle();
        myCircle.radius = 10.0;
        myCircle.show(myCircle.radius, myCircle.findArea());
    }
}