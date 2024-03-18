#include <stdio.h>
int main(){
	unsigned short n1;
	scanf("%hu", &n1);
	while(n1 != 0){
		printf("%hu\n", n1);
		n1--;
	}
	return 0;
}
