#include <stdio.h>

int main(){
	char qwer[2001];
	fgets(qwer, 2000, stdin);
	printf("%s", qwer);
	return 0;
}
