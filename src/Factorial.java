import java.util.Scanner;

public class Factorial {
    public static void main(String[] args) {
        System.out.println(factorial());
        System.out.println(factorial());
    }

    public static int factorial() {
        Scanner sc = new Scanner(System.in);
        System.out.print("숫자를 입력하세요: ");
        int n = sc.nextInt();
        int result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }
}