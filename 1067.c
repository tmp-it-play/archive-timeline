#include <stdio.h>

int main(main){
	int number = 0;
	scanf("%d", &number);
	if (number > 0){
		printf("plus\n");
		if(number % 2 == 0)
			printf("even\n");
		else
			printf("odd\n");
	}
	if (number < 0){
		printf("minus\n");
		if(number % 2 == 0)
			printf("even\n");
		else
			printf("odd\n");
	}
}
