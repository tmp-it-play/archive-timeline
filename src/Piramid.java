public class Piramid {
    public static void main(String[] agrs) {
        printPiramid(4);
        printPiramid(7);
    }

    public static void printPiramid(int n) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}