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

public class object_aim {
    public static void main(String[] args) {
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