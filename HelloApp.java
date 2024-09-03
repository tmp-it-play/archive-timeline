package basic;

public class HelloApp {

	private static final StudentId studentId = new StudentId();

	public HelloApp() {
		// TODO 자동 생성된 생성자 스텁
	}

	public static void main(String[] args) {
		System.out.println("Hello,World");
		float n = 2049;
		n /= 45;
		System.out.println(n);
		studentId.setName("김태은");
		studentId.setStudentId(1404);
		System.out.print(studentId.getName() + " ");
		System.out.println(studentId.getStudentId());
	}
}