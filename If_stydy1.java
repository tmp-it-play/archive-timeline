package sec06;
import java.util.Scanner;
public class If_stydy1 {

	@SuppressWarnings("unused")
	public static void master(String[] args) {
		Scanner in = new Scanner(System.in);
		while(true) {
		int number = 0;
		System.out.print("숫자를 입력하세요 : ");
		number = in.nextInt( );
		if (number % 2 == 0)
			System.out.println("짝수");
		if(number % 2 == 1)
			System.out.println("홀수");
			reroll:	
			continue_reroll:
					{
			System.out.print("계속 하시겠습니까? : ");
			char yes_and_no = in.next().charAt(0);
			switch(yes_and_no) {
				case 'Y':
					break reroll;
				case 'N':
					System.exit(0);
				default:
					System.out.println("잘못된 값입니다\nY 또는 N 를 입력해주세요");
					break continue_reroll;
						}
					

		}
		
		
	}

	}
}
