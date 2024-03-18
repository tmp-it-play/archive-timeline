#include <stdio.h>

int main(void){
	int number = 0;
	while(1){
		scanf("%d", &number);
		if(number == 0)
			break;
		else
			printf("%d\n", number);
	}
}
