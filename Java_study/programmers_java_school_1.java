package Java_study;

public class programmers_java_school_1 {   //String Class 강의
    public static void ex1() {
        String str1 = "Hello World";
        String str2 = "Hello World";
        int[] age = {15, 19, 66, 7};
        short i = 1;
        for (int n:age) {
            System.out.println(i + "번째 사람의 나이는" + n + "살 입니다.");
            i++;
        }
        String str3 = "Hello World";
        String str4 = "Hello World";
        if (str1 == str2) System.out.println("str1==str2입니다!!");
        if (str1 == str3) System.out.println("str1==str3입니다!!");
        if (str3 == str4) System.out.println("str3==str4입니다!!");
        else if (str1.equals(str2)) System.out.print("str1==str2이네요????\n");
    }
}
