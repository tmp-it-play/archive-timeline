#include <stdio.h>

int main(void){
	unsigned short hour = 0, minute = 0;
	scanf("%hu:%hu", &hour, &minute);
	printf("%hu:%hu",hour ,minute);
	return 0;
}
