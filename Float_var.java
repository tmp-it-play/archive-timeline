package sec06;

public class Float_var {
	public static void main2(String[] args) {
		int number1;
		double double1 = 0;
		byte number2 = 0;
		number1=7/4;
		System.out.println(number1);
		double1 = 7/4;
		System.out.println(double1);
		double1 = 7 / (double)4;
		System.out.println(double1);
		number1 = 300;
		if(number1 < Byte.MIN_VALUE || number1 > Byte.MAX_VALUE)
			System.out.println("byte 타입으로 변환할 수 없습니다.");
		else
			number2 = (byte) number1;
		byte number3 = Byte.MAX_VALUE;
		System.out.printf("%d", number3);
	}
}
