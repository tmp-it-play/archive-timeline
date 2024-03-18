#include <stdio.h>
int main(void){
	int sum = 0, i;
	unsigned short number;
	scanf("%hu", &number);
	for (i = 1; i <= number; i++){
		if(i % 2 == 0){
			sum = sum + i;
		}
		else{
			continue;
 		}
	}
	printf("%d", sum);
	return 0;
}
