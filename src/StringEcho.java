public class StringEcho {
    public static void main(String[] args) {
        echo("Hello, World!", 5);
    }

    public static void echo(String msg, int cnt) {
        for (int i = 0; i < cnt; i++) {
            System.out.println(msg);
        }
    }
}