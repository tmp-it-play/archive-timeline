import java.util.Scanner;

public class PizzaGame {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("음식 이름을 입력해주세요: ");
        String food = sc.next();
        System.out.print("음식의 가격을 입력해주세요: ");
        int price = sc.nextInt();
        System.out.print("음식의 수량을 입력해주세요: ");
        int count = sc.nextInt();
        System.out.println(food + " " + count + "개를 " + price * count + "원에 구매하였습니다.");
    }
}