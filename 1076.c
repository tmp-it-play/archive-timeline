#include <stdio.h>
int main(void){
	char c_input = 0, c_hang = 'a';
	scanf("%c", &c_input);
	do{
		printf("%c ", c_hang);
		c_hang += 1;
	} while (c_hang < c_input + 1);
	return 0;
}
