#include <stdio.h>
int main(void){
	char c1 = 0;
	ruleback:
	scanf("%c", &c1);
	if (c1 == 'q'){
		goto gogogo;
	}
	else{
		printf("%c", c1);
		goto ruleback;
	}
	gogogo:
	printf("%c", c1);
	return 0;
}
