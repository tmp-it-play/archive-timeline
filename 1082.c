#include <stdio.h>

int main(void){
	int i,hexnum = 0;
	scanf("%X", &hexnum);
	for(i = 1;i<=15;i++){
		printf("%X*%X=%X\n", hexnum, i, hexnum*i);		
	}
	return 0;
}
