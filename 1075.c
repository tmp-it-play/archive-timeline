#include <stdio.h>
int main(){
	unsigned short n1;
	scanf("%hu", &n1);
	while(n1 != 0){
		n1--;
		printf("%d\n", n1);
	}
	return 0;
}
