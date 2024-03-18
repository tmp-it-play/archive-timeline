#include <stdio.h>
int main(void){
	int number, i = 0, temp, sum = 0;
	scanf("%d", &number);
	while(sum < number){
		sum = sum + i;
		temp = i;
		i++;
	}
	printf("%d", temp);
	return 0;
}
