package Java_study;

public class methodDemo {
    public static void method_throw_away(String[] args) {
        echo("안녕!", 3);
        output("잘가!");
    }

    public static void output(String hey) {
        System.out.println(hey);
    }

    public static void echo(String s, int n) {
        for (int i = 0; i < n; i++)
            System.out.println(s);
    }

    public static void main(String[] agrs) {
        int x = 0;
        System.out.println("increment() 메서드를 호출하기 전의 x는 " + x);
        intcrement(x);
        System.out.println("increment() 메서드를 호출한 후의 x는 " + x);
    }
    public static void intcrement(int n){

    }
}