import java.util.Scanner;

public class SelectGame {
    public static void main(String[] agrs) {
        Scanner sc = new Scanner(System.in);
        int totalProductPrice = 0;
        while (true) {
            System.out.print("1: 상품 입력, 2: 결제, 3: 프로그램 종료 \n");
            short option = sc.nextShort();
            switch (option) {
                case 1:
                    System.out.print("상품명을 입력해주세요: ");
                    String productName = sc.next();
                    System.out.print("상품 가격을 입력해주세요: ");
                    int productPrice = sc.nextInt();
                    System.out.print("상품 수량을 입력해주세요: ");
                    int productQuantity = sc.nextInt();
                    totalProductPrice += productPrice * productQuantity;
                    System.out.println("상품명: " + productName + " 가격: " + productPrice + "  수량: " + productQuantity + " 합계: " + totalProductPrice);
                    continue;
                case 2:
                    System.out.print("총 비용:");
                    System.out.println(totalProductPrice + "원");
                    totalProductPrice = 0;
                    continue;
                case 3:
                    System.out.println("프로그램 종료");
                    break;
                default:
                    System.out.println("잘못된 입력입니다.");
                    continue;
            }
            break;
        }
    }
}