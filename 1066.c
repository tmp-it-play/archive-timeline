#include <stdio.h>

int main(){
	unsigned int num1, num2, num3;
	scanf("%u %u %u", &num1, &num2, &num3);
	if(num1 % 2 == 0){
		printf("even\n");
	}	
	else{
		printf("odd\n");
	}	
	if(num2 % 2 == 0){
			printf("even\n");
	}
	else{
		printf("odd\n");
	}	
	if(num3 % 2 == 0){
		printf("even\n");
	}	
	else{
			printf("odd\n");
	}
	return 0;
}
