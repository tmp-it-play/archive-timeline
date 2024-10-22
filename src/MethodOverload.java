public class MethodOverload {
    public static void main(String[] args) {
        oddPrint(15);
        oddPrint(10);
    }

    public static void oddPrint(int x) {
        if (x % 2 != 0) {
            System.out.println(x);
        }
    }
}
