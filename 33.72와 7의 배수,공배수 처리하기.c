/*
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
int main() {
	unsigned short n1 = 0, n2 = 0;
	scanf("%d %d", &n1, &n2);
	for (unsigned char i = n1 ; i <= n2; i++) {
		if (i % 5 == 0 && i % 11 == 0)
			printf("FizzBuzz\n");
		else if (i % 5 == 0)
			printf("Fizz\n");
		else if (i % 11 == 0)
			printf("Buzz\n");
		else
			printf("%d\n", i);
	}
	return 0;
}
*/