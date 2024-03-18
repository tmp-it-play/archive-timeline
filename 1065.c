#include <stdio.h>

int main(void){
	unsigned int a, b, c;
	scanf("%u %u %u", &a, &b, &c);
	if(a % 2 == 0)
		printf("%u\n", a);
	if(b % 2 == 0)
		printf("%u\n", b);
	if(c % 2 == 0)
		printf("%u\n", c);
	return 0;
}
