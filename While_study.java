package sec06;

public class While_study {

	public void while_simple() {
		int row = 2;
		while (row < 10) {
			int column = 1;
			while (column < 10) {
				System.out.printf("%4d", row * column);
				column++;
			}
			System.out.println();
			row++;
		}
	}

	public void do_while_study(String[] args) {
		int i = 10;
		do {
			i++;
		} while (i < 5);
		System.out.printf("do while문 실행 후: %d\n", i);
		i = 10;
		while (i < 5) {
			i++;
		}
		System.out.printf("while문 실행 후: %d\n", i);
	}

	public static void for_x(String[] agrs) {
		for (int row = 2; row < 10; row++) {
			for (int column = 1; column < 10; column++) {
				System.out.printf("%4d", row * column);
			}
			System.out.printf("\n");
		}
	}
}