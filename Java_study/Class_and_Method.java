package Java_study;

public class Class_and_Method {
    static int globalScope=10;
    public static void main(String[] args) {
        programmers_java_school_1 Method_T=new programmers_java_school_1();
        programmers_java_school_1.ex1();
        System.out.println("");
        Method_T.ex1();
        String tremp1="Oh My Go";
        System.out.println(globalScope);
        System.out.println(tremp1.concat("d!"));
    }
}
