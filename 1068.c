#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void) {
	unsigned short score = 0;
	scanf("%hu", &score);
	if (score >= 90)
		printf("A");
	else if (score >= 70)
		printf("B");
	else if (score >= 40)
		printf("C");
	else
		printf("D");
	return 0;
}