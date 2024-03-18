#include <stdio.h>

int main(void){
	int n1;
	do{
		scanf("%d", &n1);
		if(n1 != 0)
			printf("%d\n", n1);
		else
			exit(0);	
	} while(n1 != 0);
	return 0;
}
